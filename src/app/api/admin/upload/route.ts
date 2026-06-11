import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifySessionToken, getSessionCookieName } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const sessionToken = request.cookies.get(getSessionCookieName())?.value;
  if (sessionToken && verifySessionToken(sessionToken)) return true;
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.HACKSL_ADMIN_SECRET || "hacksl-admin-2025";
  if (authHeader && authHeader === `Bearer ${adminSecret}`) return true;
  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
  }

  const blob = await put(`hackathons/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
