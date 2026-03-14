import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Hackathon } from "@/lib/hackathons";

const DATA_PATH = path.join(process.cwd(), "data", "hackathons.json");

function authFailed(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.HACKSL_ADMIN_SECRET || "hacksl-admin-2025";

  if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
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
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.HACKSL_ADMIN_SECRET || "hacksl-admin-2025";

  if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
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
    return NextResponse.json(
      { error: "Failed to delete hackathon" },
      { status: 500 }
    );
  }
}
