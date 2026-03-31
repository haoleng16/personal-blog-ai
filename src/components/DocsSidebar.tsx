import Link from "next/link";
import { getGroupedPosts } from "@/lib/posts";

export default function DocsSidebar({ currentSlug }: { currentSlug?: string }) {
  const groups = getGroupedPosts();
  const totalPosts = groups.reduce((sum, group) => sum + group.posts.length, 0);

  return (
    <aside className="docs-sidebar panel-glass rounded-[2rem] border border-[var(--border)] p-4 sm:p-5">
      <div className="border-b border-[var(--border)] px-2 pb-4">
        <div className="editorial-kicker text-[var(--muted-foreground)]">Private Archive</div>
        <Link href="/" className="mt-3 block text-2xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
          木木的小站
        </Link>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          不是工具面板，而是个人内容馆。侧栏像目录页，负责让信息更安静地展开。
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-1">
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Sections</div>
          <div className="mt-2 text-2xl font-semibold tracking-[-0.05em]">{groups.length}</div>
        </div>
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Posts</div>
          <div className="mt-2 text-2xl font-semibold tracking-[-0.05em]">{totalPosts}</div>
        </div>
      </div>

      <nav className="mt-5 space-y-5">
        {groups.map((group, index) => (
          <section key={group.section}>
            <div className="flex items-center justify-between gap-3 px-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {String(index + 1).padStart(2, "0")} / {group.section}
              </h2>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                {group.posts.length}
              </span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {group.posts.map((post) => {
                const active = post.slug === currentSlug;
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className={[
                        "block rounded-[1rem] border px-3 py-3 text-sm transition",
                        active
                          ? "border-[var(--accent)] bg-[var(--surface-muted)] text-[var(--foreground)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_25%,transparent)]"
                          : "border-transparent text-[var(--muted-foreground)] hover:border-[var(--border)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
                      ].join(" ")}
                    >
                      <div className="font-medium tracking-[-0.02em]">{post.frontmatter.title}</div>
                      {post.frontmatter.description ? (
                        <div className="mt-1.5 line-clamp-2 text-xs leading-5 opacity-80">
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
