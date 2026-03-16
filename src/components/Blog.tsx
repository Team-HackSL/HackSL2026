const POSTS = [
  {
    id: "1",
    title: "Sri Lanka's Tech Ecosystem in 2025",
    excerpt: "A look at the growing hackathon and innovation scene across the island.",
    date: "2025-02-15",
    slug: "tech-ecosystem-2025",
  },
  {
    id: "2",
    title: "How to Run a Successful Hackathon",
    excerpt: "Tips for organizers: planning, promotion, and participant engagement.",
    date: "2025-01-20",
    slug: "run-successful-hackathon",
  },
  {
    id: "3",
    title: "NIBMCodeX 1.0 & IEEEXtreme 19.0 Recap",
    excerpt: "Highlights from one of Sri Lanka's largest coding challenges.",
    date: "2024-11-10",
    slug: "nibmcodex-recap",
  },
  {
    id: "4",
    title: "First-Time Hackathon Participant Guide",
    excerpt: "What to expect, how to prepare, and how to make the most of your first hackathon.",
    date: "2025-03-01",
    slug: "first-hackathon-guide",
  },
  {
    id: "5",
    title: "Meet the HackSL Fellows: Campus Ambassadors",
    excerpt: "Introducing our University Ambassador program and the students driving tech on campus.",
    date: "2025-02-28",
    slug: "hacksl-fellows-intro",
  },
  {
    id: "6",
    title: "University of Moratuwa HackFest 2025",
    excerpt: "Recap of the annual student hackathon and the winning projects.",
    date: "2025-02-20",
    slug: "uom-hackfest-2025",
  },
  {
    id: "7",
    title: "Building Community: HackSL's First Year",
    excerpt: "Lessons learned and milestones from HackSL's founding year.",
    date: "2024-12-01",
    slug: "hacksl-first-year",
  },
  {
    id: "8",
    title: "Why Sri Lanka Needs More Hackathons",
    excerpt: "The impact of hackathons on skills, startups, and the local tech industry.",
    date: "2024-10-15",
    slug: "why-sri-lanka-needs-hackathons",
  },
  {
    id: "9",
    title: "Remote vs In-Person: Finding the Right Format",
    excerpt: "A guide for organizers choosing between online and physical hackathon formats.",
    date: "2024-09-20",
    slug: "remote-vs-in-person-hackathons",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Blog() {
  return (
    <section id="blog" className="border-t border-[var(--border)] bg-[var(--accent-light)] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Blog
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
          Updates, guides, and stories from the Sri Lankan tech community.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <article
              key={post.id}
              className="group cursor-pointer rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="text-sm text-[var(--accent)]">{formatDate(post.date)}</p>
              <h3 className="mt-2 font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                {post.excerpt}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-[var(--accent)]">
                Read more →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
