import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import type { Hackathon } from "@/lib/hackathon-types";
import { ensureHackathonsTable } from "@/lib/db";
import {
  verifySessionToken,
  getSessionCookieName,
} from "@/lib/auth";

function authFailed(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isAuthenticated(request: NextRequest): boolean {
  // Session cookie (username/password login)
  const sessionToken = request.cookies.get(getSessionCookieName())?.value;
  if (sessionToken && verifySessionToken(sessionToken)) {
    return true;
  }
  // Legacy Bearer token
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
    await ensureHackathonsTable();

    const id = body.id || `hack-${Date.now()}`;
    const validated: Hackathon = {
      id,
      name: body.name || "Untitled Hackathon",
      description: body.description || "",
      date: body.date || new Date().toISOString().split("T")[0],
      location: body.location || "",
      registrationUrl: body.registrationUrl || "#",
      organizer: body.organizer || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      image: body.image || undefined,
      mode: body.mode === "online" || body.mode === "in-person" ? body.mode : undefined,
      status:
        body.status === "upcoming" || body.status === "open" || body.status === "ended"
          ? body.status
          : undefined,
      length:
        body.length === "1-6 days" || body.length === "1-4 weeks" || body.length === "1+ month"
          ? body.length
          : undefined,
    };

    await sql`
      INSERT INTO hackathons (
        id, name, description, date, location,
        registration_url, organizer, tags, image, mode, status, length
      )
      VALUES (
        ${validated.id},
        ${validated.name},
        ${validated.description},
        ${validated.date},
        ${validated.location},
        ${validated.registrationUrl},
        ${validated.organizer},
        ${validated.tags as any},
        ${validated.image ?? null},
        ${validated.mode ?? null},
        ${validated.status ?? null},
        ${validated.length ?? null}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        date = EXCLUDED.date,
        location = EXCLUDED.location,
        registration_url = EXCLUDED.registration_url,
        organizer = EXCLUDED.organizer,
        tags = EXCLUDED.tags,
        image = EXCLUDED.image,
        mode = EXCLUDED.mode,
        status = EXCLUDED.status,
        length = EXCLUDED.length
    `;

    return NextResponse.json({ success: true, hackathon: validated });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save hackathon" },
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
    await ensureHackathonsTable();
    await sql`DELETE FROM hackathons WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete hackathon" },
      { status: 500 }
    );
  }
}
