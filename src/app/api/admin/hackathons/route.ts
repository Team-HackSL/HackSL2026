import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Hackathon } from "@/lib/hackathons";
import {
  verifySessionToken,
  getSessionCookieName,
} from "@/lib/auth";

const DATA_PATH = path.join(process.cwd(), "data", "hackathons.json");

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
    const hackathons: Hackathon[] = JSON.parse(
      await readFile(DATA_PATH, "utf-8")
    );

    const newHackathon: Hackathon = {
      id: body.id || `hack-${Date.now()}`,
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

    const existingIndex = hackathons.findIndex((h) => h.id === newHackathon.id);
    if (existingIndex >= 0) {
      hackathons[existingIndex] = newHackathon;
    } else {
      hackathons.push(newHackathon);
    }

    await writeFile(DATA_PATH, JSON.stringify(hackathons, null, 2), "utf-8");
    return NextResponse.json({ success: true, hackathon: newHackathon });
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
    const hackathons: Hackathon[] = JSON.parse(
      await readFile(DATA_PATH, "utf-8")
    );
    const filtered = hackathons.filter((h) => h.id !== id);
    await writeFile(DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete hackathon" },
      { status: 500 }
    );
  }
}
