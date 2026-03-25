import Link from "next/link";
import DocsSidebar from "@/components/DocsSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { getGroupedPosts } from "@/lib/posts";

export default function Home() {
  const groups = getGroupedPosts();
  const totalPosts = groups.reduce((sum, group) => sum + group.posts.length, 0);
  const firstPost = groups[0]?.posts[0];

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <DocsSidebar />
          </div>

          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] p-6">
              <div>
                <div className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
                  Docs Home
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--foreground)]">木木的小站</h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted-foreground)]">
                  这里现在是文档站风格：支持 Markdown 写作、左侧分组导航，以及亮色 / 暗色主题切换。点击右上角按钮就可以切换显示模式。
                </p>
              </div>
              <ThemeToggle />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">{groups.length} 个分组</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">{totalPosts} 篇文档</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">Markdown 驱动</span>
            </div>

            {firstPost ? (
              <div className="mt-6">
                <Link
                  href={`/posts/${firstPost.slug}`}
                  className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
                >
                  开始阅读
                </Link>
              </div>
            ) : null}

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {groups.map((group) => (
                <section key={group.section} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">{group.section}</h2>
                  <ul className="mt-4 space-y-3">
                    {group.posts.map((post) => (
                      <li key={post.slug}>
                        <Link href={`/posts/${post.slug}`} className="group block rounded-xl bg-[var(--surface)] px-4 py-3 shadow-sm ring-1 ring-[var(--border-soft)] transition hover:ring-sky-200 dark:hover:ring-sky-400/25">
                          <div className="font-medium text-[var(--foreground)] group-hover:text-sky-700 dark:group-hover:text-sky-300">
                            {post.frontmatter.title}
                          </div>
                          <div className="mt-1 text-xs text-[var(--muted-foreground)]">{post.frontmatter.date}</div>
                          {post.frontmatter.description ? (
                            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{post.frontmatter.description}</p>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
