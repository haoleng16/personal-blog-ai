import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import DocsSidebar from "@/components/DocsSidebar";
import SummaryBox from "@/components/SummaryBox";
import ThemeToggle from "@/components/ThemeToggle";
import { getAdjacentPosts, getPostBySlug, listPostSlugs } from "@/lib/posts";

export function generateStaticParams() {
  return listPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { previous, next } = getAdjacentPosts(slug);

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
      },
    },
  });

  return (
    <div className="min-h-dvh text-[var(--foreground)] transition-colors">
      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="site-shell rounded-[2rem] border border-[var(--border)] bg-[var(--background-elevated)] p-3 sm:p-4 lg:p-5">
          <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <DocsSidebar currentSlug={slug} />
            </div>

            <div className="space-y-6">
              <header className="panel-glass rounded-[2rem] border border-[var(--border)] p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="editorial-kicker text-[var(--muted-foreground)]">Article Node</div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                      <Link href="/" className="font-medium text-[var(--foreground)] hover:text-[var(--accent)]">
                        木木的小站
                      </Link>
                      <span>/</span>
                      <span>{post.frontmatter.section || "未分类"}</span>
                    </div>
                    <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                      {post.frontmatter.title}
                    </h1>
                  </div>
                  <ThemeToggle />
                </div>

                <div className="mt-5 text-sm text-[var(--muted-foreground)]">{post.frontmatter.date}</div>
                {post.frontmatter.tags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.frontmatter.tags.map((t) => (
                      <span key={t} className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs text-[var(--foreground)]">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
                {post.frontmatter.description ? (
                  <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                    {post.frontmatter.description}
                  </p>
                ) : null}
              </header>

              <section className="panel-glass rounded-[2rem] border border-[var(--border)] p-6">
                <SummaryBox slug={post.slug} />
              </section>

              <article className="docs-prose panel-glass rounded-[2rem] border border-[var(--border)] p-6 sm:p-8 lg:p-10">
                {content}
              </article>

              <nav className="grid gap-4 md:grid-cols-2">
                <div className="panel-glass rounded-[1.5rem] border border-[var(--border)] p-5">
                  <div className="editorial-kicker text-[var(--muted-foreground)]">上一篇</div>
                  {previous ? (
                    <Link href={`/posts/${previous.slug}`} className="mt-3 block text-base font-medium tracking-[-0.03em] text-[var(--foreground)] hover:text-[var(--accent)]">
                      {previous.frontmatter.title}
                    </Link>
                  ) : (
                    <div className="mt-3 text-sm text-[var(--muted-foreground)] opacity-70">没有了</div>
                  )}
                </div>
                <div className="panel-glass rounded-[1.5rem] border border-[var(--border)] p-5">
                  <div className="editorial-kicker text-[var(--muted-foreground)]">下一篇</div>
                  {next ? (
                    <Link href={`/posts/${next.slug}`} className="mt-3 block text-base font-medium tracking-[-0.03em] text-[var(--foreground)] hover:text-[var(--accent)]">
                      {next.frontmatter.title}
                    </Link>
                  ) : (
                    <div className="mt-3 text-sm text-[var(--muted-foreground)] opacity-70">没有了</div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
