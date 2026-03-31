import Link from "next/link";
import DocsSidebar from "@/components/DocsSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { getGroupedPosts } from "@/lib/posts";

export default function Home() {
  const groups = getGroupedPosts();
  const totalPosts = groups.reduce((sum, group) => sum + group.posts.length, 0);
  const firstPost = groups[0]?.posts[0];
  const latestGroup = groups[0];

  return (
    <div className="min-h-dvh text-[var(--foreground)] transition-colors">
      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="site-shell rounded-[2rem] border border-[var(--border)] bg-[var(--background-elevated)] p-3 sm:p-4 lg:p-5">
          <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <DocsSidebar />
            </div>

            <section className="panel-glass rounded-[2rem] border border-[var(--border)] p-4 sm:p-6 lg:p-8">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_320px]">
                <div className="rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--surface-muted)] p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="editorial-kicker text-[var(--muted-foreground)]">Independent Notes Archive</div>
                    <ThemeToggle />
                  </div>

                  <div className="mt-10 max-w-5xl">
                    <p className="text-sm tracking-[0.25em] text-[var(--muted-foreground)] uppercase">木木的小站 / editorial library</p>
                    <h1 className="hero-title mt-4 text-[3.3rem] font-semibold sm:text-[4.6rem] lg:text-[6.4rem]">
                      让内容像一座
                      <span className="hero-outline block">被认真设计过的建筑</span>
                    </h1>
                    <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                      这里不是那种一眼就看出“AI 拼出来”的模板博客，而是一座有秩序、有留白、有压迫感也有温度的个人内容馆。
                      文档、笔记、教程和归档都被重新组织成更像作品集的阅读体验。
                    </p>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-3">
                    {firstPost ? (
                      <Link
                        href={`/posts/${firstPost.slug}`}
                        className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:translate-y-[-1px] hover:opacity-95"
                      >
                        进入主阅读入口
                      </Link>
                    ) : null}
                    <a
                      href="#collections"
                      className="inline-flex items-center rounded-full border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface)]"
                    >
                      浏览全部分区
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="metric-card rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="editorial-kicker text-[var(--muted-foreground)]">Collections</div>
                    <div className="mt-4 text-4xl font-semibold tracking-[-0.06em]">{groups.length}</div>
                    <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">按主题归档，而不是简单堆文章。</p>
                  </div>
                  <div className="metric-card rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="editorial-kicker text-[var(--muted-foreground)]">Documents</div>
                    <div className="mt-4 text-4xl font-semibold tracking-[-0.06em]">{totalPosts}</div>
                    <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">每篇都可直达、可阅读、可继续扩写。</p>
                  </div>
                  <div className="metric-card rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="editorial-kicker text-[var(--muted-foreground)]">Latest Focus</div>
                    <div className="mt-4 text-xl font-semibold tracking-[-0.04em]">{latestGroup?.section ?? "等待内容"}</div>
                    <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">当前首页视觉强调“内容资产馆”而不是“工具演示页”。</p>
                  </div>
                </div>
              </div>

              <section id="collections" className="mt-8 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 lg:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
                  <div>
                    <div className="editorial-kicker text-[var(--muted-foreground)]">Curated Sections</div>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">像画册目录一样浏览内容</h2>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
                    不是典型 SaaS 卡片墙，也不是花里胡哨的 AI 展示板。每个分区都更接近一本主题册，强调秩序、比例和阅读气质。
                  </p>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                  {groups.map((group, groupIndex) => (
                    <section
                      key={group.section}
                      className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 transition hover:-translate-y-1 hover:border-[var(--border-strong)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="editorial-kicker text-[var(--muted-foreground)]">Section {String(groupIndex + 1).padStart(2, "0")}</div>
                          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{group.section}</h3>
                        </div>
                        <div className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                          {group.posts.length} 篇
                        </div>
                      </div>

                      <ul className="mt-5 space-y-3">
                        {group.posts.map((post) => (
                          <li key={post.slug}>
                            <Link
                              href={`/posts/${post.slug}`}
                              className="group block rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="text-base font-medium tracking-[-0.03em] text-[var(--foreground)]">
                                    {post.frontmatter.title}
                                  </div>
                                  {post.frontmatter.description ? (
                                    <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{post.frontmatter.description}</p>
                                  ) : null}
                                </div>
                                <div className="shrink-0 text-xs tracking-[0.16em] text-[var(--muted-foreground)] uppercase">
                                  {post.frontmatter.date}
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
