import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getSessionCookieName } from "@/lib/auth";

const PORTAL_API = process.env.PORTAL_API_URL || "http://localhost:5080";
const ADMIN_SECRET = process.env.HACKSL_ADMIN_SECRET || "hacksl-admin-2025";

function isAuthenticated(request: NextRequest): boolean {
  const sessionToken = request.cookies.get(getSessionCookieName())?.value;
  if (sessionToken && verifySessionToken(sessionToken)) return true;
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader === `Bearer ${ADMIN_SECRET}`) return true;
  return false;
}

// List all portal members (proxied from the .NET portal API). Never returns passwords.
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${PORTAL_API}/api/admin/members`, {
      headers: { "X-Admin-Secret": ADMIN_SECRET },
      cache: "no-store",
    });
    const data = await res.json().catch(() => []);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the portal API. Is the .NET backend running?" },
      { status: 502 }
    );
  }
}
