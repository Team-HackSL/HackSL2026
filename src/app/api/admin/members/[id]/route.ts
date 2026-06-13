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

// Remove a member by user id (proxied to the .NET portal API).
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const res = await fetch(`${PORTAL_API}/api/admin/members/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "X-Admin-Secret": ADMIN_SECRET },
    });
    if (res.ok) return new NextResponse(null, { status: 204 });
    const data = await res.json().catch(() => ({ error: "Delete failed" }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the portal API. Is the .NET backend running?" },
      { status: 502 }
    );
  }
}
