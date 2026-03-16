import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import type { BlogPost } from "@/lib/blog-types";
import { ensureBlogsTable } from "@/lib/db";
import { verifySessionToken, getSessionCookieName } from "@/lib/auth";

function authFailed(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isAuthenticated(request: NextRequest): boolean {
  const sessionToken = request.cookies.get(getSessionCookieName())?.value;
  if (sessionToken && verifySessionToken(sessionToken)) {
    return true;
  }
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.HACKSL_ADMIN_SECRET || "hacksl-admin-2025";
  if (authHeader && authHeader === `Bearer ${adminSecret}`) {
    return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return authFailed();
  }

  try {
    const body = await request.json();
    await ensureBlogsTable();

    const id = body.id || `blog-${Date.now()}`;
    const validated: BlogPost = {
      id,
      title: body.title || "Untitled Post",
      excerpt: body.excerpt || "",
      date: body.date || new Date().toISOString().split("T")[0],
      slug: body.slug || id,
      image: body.image || undefined,
      content: body.content || undefined,
    };

    await sql`
      INSERT INTO blogs (id, title, excerpt, date, slug, image, content)
      VALUES (
        ${validated.id},
        ${validated.title},
        ${validated.excerpt},
        ${validated.date},
        ${validated.slug},
        ${validated.image ?? null},
        ${validated.content ?? null}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        date = EXCLUDED.date,
        slug = EXCLUDED.slug,
        image = EXCLUDED.image,
        content = EXCLUDED.content
    `;

    return NextResponse.json({ success: true, post: validated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return authFailed();
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  try {
    await ensureBlogsTable();
    await sql`DELETE FROM blogs WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

