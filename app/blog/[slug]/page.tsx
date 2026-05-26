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

        <article className="mx-auto max-w-2xl">
          {/* Header */}
          <header className="mb-xl">
            <div className="mb-md">
              <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-caption font-medium text-brand-accent">
                {post.category}
              </span>
            </div>
            <h1 className="mb-md font-display text-display-sm font-semibold text-ink leading-tight">
              {post.title}
            </h1>
            <p className="mb-md text-body-md text-muted">{post.excerpt}</p>
            <div className="flex items-center gap-md text-caption text-muted">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* MDX Content */}
          <div className="prose prose-neutral max-w-none
            prose-headings:font-display prose-headings:font-semibold prose-headings:text-ink
            prose-p:text-muted prose-p:text-body-md prose-p:leading-relaxed
            prose-a:text-brand-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:text-ink prose-strong:font-semibold
            prose-code:font-mono prose-code:text-[13px] prose-code:bg-surface-soft prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-table:text-body-sm
            prose-th:text-ink prose-th:font-semibold
            prose-td:text-muted
            prose-hr:border-hairline
            prose-li:text-muted">
            <MDXRemote source={post.content} />
          </div>

          {/* Back link */}
          <div className="mt-xl border-t border-hairline pt-lg">
            <a href="/blog" className="text-body-sm text-brand-accent hover:underline">
              ← Kembali ke Blog
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
