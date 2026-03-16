import { NextResponse } from "next/server";
import { getBlogs } from "@/lib/blogs";

export async function GET() {
  const blogs = await getBlogs();
  return NextResponse.json(blogs);
}

