import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

function generateCodeVerifier() {
  // Generates 43+ char safe base64url string
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier: string) {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return hash.toString("base64url");
}

export async function GET(request: Request) {
  const shopId = process.env.SHOPIFY_SHOP_ID;
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID;

  if (!shopId || !clientId) {
    return NextResponse.json(
      { error: "Shopify Customer Accounts API config missing in .env" },
      { status: 500 }
    );
  }

  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = crypto.randomBytes(16).toString("hex");

  // Save verifier and state in cookies
  const cookieStore = await cookies();
  cookieStore.set("shopify_code_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300, // 5 minutes
  });
  cookieStore.set("shopify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300, // 5 minutes
  });

  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/callback`;
  const scopes = "openid email customer";

  const authUrl = `https://shopify.com/${shopId}/auth/oauth/authorize?` +
    `client_id=${clientId}&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}&` +
    `response_type=code&` +
    `code_challenge=${challenge}&` +
    `code_challenge_method=S256`;

  return NextResponse.redirect(authUrl);
}
