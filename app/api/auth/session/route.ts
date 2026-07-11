import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("shopify_logged_in")?.value === "true";
  return NextResponse.json({ loggedIn: isLoggedIn });
}
