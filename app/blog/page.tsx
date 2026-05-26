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

        <div className="mb-xl">
          <h1 className="font-display text-display-sm font-semibold text-ink">Blog</h1>
          <p className="text-body-md text-muted">Artikel seputar kalender, hari libur, dan penanggalan.</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-body-md text-muted">Belum ada artikel.</p>
        ) : (
          <div className="flex flex-col gap-md">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-hairline bg-canvas p-lg transition-all hover:border-brand-accent/30 hover:shadow-soft"
              >
                <div className="mb-md flex items-center gap-2">
                  <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-caption font-medium text-brand-accent">
                    {post.category}
                  </span>
                </div>

                <h2 className="mb-sm font-display text-title-sm font-semibold text-ink transition-colors group-hover:text-brand-accent">
                  {post.title}
                </h2>
                <p className="mb-md text-body-sm text-muted line-clamp-2">{post.excerpt}</p>

                <div className="flex items-center gap-md text-caption text-muted">
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
