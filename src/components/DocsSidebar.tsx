import Link from "next/link";
import { getGroupedPosts } from "@/lib/posts";

export default function DocsSidebar({ currentSlug }: { currentSlug?: string }) {
  const groups = getGroupedPosts();

  return (
    <aside className="docs-sidebar rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm backdrop-blur">
      <div className="mb-4 border-b border-[var(--border-soft)] px-2 pb-3">
        <Link href="/" className="text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)]">
          木木的小站
        </Link>
        <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">Markdown 文档站 · 左侧层级导航</p>
      </div>

      <nav className="space-y-4">
        {groups.map((group) => (
          <section key={group.section}>
            <h2 className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] opacity-80">
              {group.section}
            </h2>
            <ul className="mt-2 space-y-1">
              {group.posts.map((post) => {
                const active = post.slug === currentSlug;
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className={[
                        "block rounded-xl px-3 py-2 text-sm transition",
                        active
                          ? "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-400/25"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
                      ].join(" ")}
                    >
                      <div className="font-medium">{post.frontmatter.title}</div>
                      {post.frontmatter.description ? (
                        <div className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)] opacity-80">
                          {post.frontmatter.description}
                        </div>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
    </aside>
  );
}
