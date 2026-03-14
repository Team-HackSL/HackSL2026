import { NextResponse } from "next/server";
import { getHackathons } from "@/lib/hackathons";

export async function GET() {
  const hackathons = await getHackathons();
  return NextResponse.json(hackathons);
}
