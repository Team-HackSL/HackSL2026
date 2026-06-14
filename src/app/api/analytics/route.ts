import { NextRequest, NextResponse } from "next/server";
import { incrementBlogClicks } from "@/lib/blogs";
import { incrementHackathonViews } from "@/lib/hackathons";

/**
 * Records lightweight engagement analytics fired from the public cards.
 *
 * This endpoint is intentionally unauthenticated and fire-and-forget: it is
 * called via `navigator.sendBeacon` when a visitor opens a blog post or event
 * card. It only ever increments a counter, so it cannot leak or mutate content.
 *
 *   { type: "blog",      event: "click", id }  -> blogs.clicks + 1
 *   { type: "hackathon", event: "view",  id }  -> hackathons.views + 1
 *
 * Blog *views* are counted server-side when the detail page renders, so they
 * are not handled here.
 */
export async function POST(request: NextRequest) {
  let body: { type?: string; event?: string; id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { type, event, id } = body;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (type === "blog" && event === "click") {
    await incrementBlogClicks(id);
    return NextResponse.json({ ok: true });
  }

  if (type === "hackathon" && event === "view") {
    await incrementHackathonViews(id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unsupported event" }, { status: 400 });
}
