import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Clock } from "lucide-react";

interface Props {
  params: { slug: string };
}

// Category → color block mapping
const CATEGORY_COLORS: Record<string, string> = {
  "Hari Libur":   "bg-block-coral",
  "Kalender":     "bg-block-cream",
  "Weton":        "bg-block-lilac",
  "Long Weekend": "bg-block-lime",
  "Tips":         "bg-block-mint",
  "API":          "bg-block-pink",
};

function getCategoryBg(category: string): string {
  return CATEGORY_COLORS[category] ?? "bg-block-cream";
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | Kalend Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
    alternates: { canonical: `/blog/${params.slug}` },
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Breadcrumb items={[
            { label: "Beranda", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]} />
        </div>

        <article className="mx-auto pt-4">
          {/* Color block hero header */}
          <header className={`${getCategoryBg(post.category)} mb-xl rounded-lg p-xxl`}>
            <p className="mb-sm font-mono text-caption uppercase tracking-widest text-ink/60">
              {post.category}
            </p>
            <h1 className="mb-md font-display text-display-lg font-normal text-ink leading-tight">
              {post.title}
            </h1>
            <p className="mb-md font-display text-body-lg text-ink">{post.excerpt}</p>
            <div className="flex items-center gap-md font-mono text-caption text-ink/60">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* MDX Content */}
          <div className="prose prose-neutral max-w-none
            prose-headings:font-display prose-headings:font-normal prose-headings:text-ink
            prose-p:font-display prose-p:text-ink prose-p:text-body prose-p:leading-relaxed
            prose-a:text-ink prose-a:underline prose-a:underline-offset-2 hover:prose-a:opacity-70
            prose-strong:text-ink prose-strong:font-semibold
            prose-code:font-mono prose-code:text-caption prose-code:bg-surface-soft prose-code:px-xs prose-code:py-xxs prose-code:rounded-sm
            prose-table:font-display prose-table:text-body-sm
            prose-th:text-ink prose-th:font-semibold
            prose-td:text-ink
            prose-hr:border-hairline
            prose-li:font-display prose-li:text-ink px-4">
            <MDXRemote source={post.content} />
          </div>

          <div className="mt-xl border-t border-hairline pt-lg">
            <a
              href="/blog"
              className="inline-flex items-center gap-xs rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-white transition-opacity hover:opacity-80"
            >
              ← Kembali ke Blog
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
