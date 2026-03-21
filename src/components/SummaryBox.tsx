"use client";

import { useMemo, useState } from "react";

type ApiResp =
  | { ok: true; cached: boolean; slug: string; hash: string; model: string; summary: { bullets: string[]; conclusion: string } }
  | { ok: false; error: string };

export default function SummaryBox({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResp | null>(null);

  const bullets = useMemo(() => (data && data.ok ? data.summary.bullets : []), [data]);

  async function run(force = false) {
    setLoading(true);
    try {
      const adminToken = (window as any).__ADMIN_TOKEN__ as string | undefined;
      const resp = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, force, adminToken }),
      });
      const json = (await resp.json()) as ApiResp;
      setData(json);
    } catch (e: any) {
      setData({ ok: false, error: e?.message || String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">AI 摘要</div>
          {data && data.ok ? (
            <div className="mt-1 text-xs text-zinc-500">
              model: {data.model} · {data.cached ? "cached" : "fresh"}
            </div>
          ) : (
            <div className="mt-1 text-xs text-zinc-500">点击生成（结果会缓存）</div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
            onClick={() => run(false)}
            disabled={loading}
          >
            {loading ? "生成中…" : "生成摘要"}
          </button>
          <button
            className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
            onClick={() => run(true)}
            disabled={loading}
          >
            强制刷新
          </button>
        </div>
      </div>

      {data && !data.ok ? <div className="mt-4 text-sm text-red-600">{data.error}</div> : null}

      {data && data.ok ? (
        <div className="mt-4 space-y-3">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
          <div className="rounded-lg bg-zinc-50 p-3 text-sm">
            <span className="font-semibold">结论：</span>
            {data.summary.conclusion}
          </div>
        </div>
      ) : null}
    </div>
  );
}
