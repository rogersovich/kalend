import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllPosts } from "@/lib/blog";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Artikel Kalender, Hari Libur & Weton | Kalend",
  description: "Artikel seputar kalender Indonesia dan Malaysia, strategi cuti efisien, penanggalan Jawa, dan sejarah hari libur nasional.",
  openGraph: {
    title: "Blog Kalend — Artikel Kalender & Hari Libur",
    description: "Artikel seputar kalender Indonesia dan Malaysia, strategi cuti, weton Jawa, dan sejarah hari libur.",
    url: "/blog",
    type: "website",
    siteName: "Kalend",
  },
  alternates: { canonical: "/blog" },
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-content px-lg py-md sm:py-xl">
        <div className="mb-md">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Blog" }]} />
        </div>

        {/* Color block hero */}
        <div className="mb-lg rounded-lg bg-block-cream p-lg sm:mb-xl sm:p-xxl">
          <p className="mb-sm font-mono text-sm uppercase tracking-widest text-ink/60 sm:text-eyebrow">Blog</p>
          <h1 className="font-display text-display-md font-normal text-ink sm:text-display-lg">Artikel Kalender</h1>
          <p className="mt-sm font-display text-body-sm text-ink sm:text-body-lg">
            Artikel seputar kalender, hari libur, dan penanggalan.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="font-display text-body text-ink">Belum ada artikel.</p>
        ) : (
          <div className="flex flex-col gap-sm sm:gap-md">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-lg border border-hairline bg-canvas p-md transition-shadow hover:shadow-elevated sm:p-lg"
              >
                <div className="mb-sm flex items-center gap-sm sm:mb-md">
                  <span className="rounded-pill bg-surface-soft px-sm py-xxs font-mono text-caption uppercase tracking-widest text-ink">
                    {post.category}
                  </span>
                </div>

                <h2 className="mb-xs font-display text-body-lg font-medium text-ink transition-opacity group-hover:opacity-70 sm:mb-sm sm:text-headline">
                  {post.title}
                </h2>
                <p className="mb-sm font-display text-body-sm text-ink line-clamp-2 sm:mb-md">{post.excerpt}</p>

                <div className="flex items-center gap-sm font-mono text-caption text-ink/50 sm:gap-md">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
    </main>
  );
}
