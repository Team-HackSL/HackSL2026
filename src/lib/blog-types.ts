export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  author?: string;
  image?: string;
  content?: string;
  /** Hackathon category this post relates to, e.g. "Designathon". */
  type?: string;
  /** Number of times the post's detail page has been viewed. */
  views?: number;
  /** Number of times the post card was clicked from a listing. */
  clicks?: number;
}

/**
 * Hackathon categories a blog post can be tagged with. Used by the admin form
 * and the blog listing filter. Keep these in sync with whatever events HackSL
 * runs; the listing treats any value not in this list as "Other".
 */
export const BLOG_TYPES = [
  "Hackathon",
  "Designathon",
  "Datathon",
  "OC",
  "CTF",
  "Other",
] as const;

export type BlogType = (typeof BLOG_TYPES)[number];
