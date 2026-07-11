import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("shopify_auth_state")?.value;
  const verifier = cookieStore.get("shopify_code_verifier")?.value;

  // Clear verification cookies immediately
  cookieStore.delete("shopify_auth_state");
  cookieStore.delete("shopify_code_verifier");

  if (!code || !state || state !== savedState || !verifier) {
    return NextResponse.json(
      { error: "Authentication state mismatch or verification cookies expired." },
      { status: 400 }
    );
  }

  const shopId = process.env.SHOPIFY_SHOP_ID;
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID;

  if (!shopId || !clientId) {
    return NextResponse.json(
      { error: "Shopify configuration variables missing in environment." },
      { status: 500 }
    );
  }

  try {
    const tokenUrl = `https://shopify.com/${shopId}/auth/oauth/token`;
    
    const origin = new URL(request.url).origin;
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: `${origin}/api/auth/callback`,
      code,
      code_verifier: verifier,
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange error response:", errorText);
      return NextResponse.json(
        { error: "Failed to exchange authorization code for token.", details: errorText },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 7200; // 2 hours default

    // Set secure HttpOnly cookie containing the raw access token for server-side fetches
    cookieStore.set("shopify_customer_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    // Set a client-readable cookie to instantly update client-side Navbar states
    cookieStore.set("shopify_logged_in", "true", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn,
    });

    // Redirect user to the new profile page
    return NextResponse.redirect(new URL("/profile", request.url));
  } catch (error: any) {
    console.error("Auth callback handler failed:", error);
    return NextResponse.json(
      { error: "Authentication callback failed", details: error.message },
      { status: 500 }
    );
  }
}
