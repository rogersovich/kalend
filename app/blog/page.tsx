import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Blog" }]} />
        </div>

        {/* Color block hero */}
        <div className="mb-xl rounded-lg bg-block-cream p-xxl">
          <p className="mb-sm font-mono text-eyebrow uppercase tracking-widest text-ink/60">Blog</p>
          <h1 className="font-display text-display-lg font-normal text-ink">Artikel Kalender</h1>
          <p className="mt-sm font-display text-body-lg text-ink">
            Artikel seputar kalender, hari libur, dan penanggalan.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="font-display text-body text-ink">Belum ada artikel.</p>
        ) : (
          <div className="flex flex-col gap-md">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-lg border border-hairline bg-canvas p-lg transition-shadow hover:shadow-elevated"
              >
                <div className="mb-md flex items-center gap-sm">
                  <span className="rounded-pill bg-surface-soft px-sm py-xxs font-mono text-caption uppercase tracking-widest text-ink">
                    {post.category}
                  </span>
                </div>

                <h2 className="mb-sm font-display text-headline text-ink transition-opacity group-hover:opacity-70">
                  {post.title}
                </h2>
                <p className="mb-md font-display text-body-sm text-ink line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center gap-md font-mono text-caption text-ink/50">
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
      <Footer />
    </>
  );
}
