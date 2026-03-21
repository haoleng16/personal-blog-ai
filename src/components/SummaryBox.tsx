"use client";

import { useMemo, useState } from "react";

type ApiResp =
  | {
      ok: true;
      cached: boolean;
      slug: string;
      hash: string;
      model: string;
      summary: { bullets: string[]; conclusion: string };
    }
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
    <div className="rounded-3xl border border-sky-100 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">AI 摘要</div>
          {data && data.ok ? (
            <div className="mt-1 text-xs text-slate-500">
              model: {data.model} · {data.cached ? "cached" : "fresh"}
            </div>
          ) : (
            <div className="mt-1 text-xs text-slate-500">点击生成（结果会缓存，省钱）</div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
            onClick={() => run(false)}
            disabled={loading}
          >
            {loading ? "生成中…" : "生成摘要"}
          </button>
          <button
            className="rounded-xl border border-sky-200 bg-white/60 px-3 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50 disabled:opacity-60"
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
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
          <div className="rounded-2xl bg-sky-50 p-4 text-sm text-slate-800 ring-1 ring-inset ring-sky-100">
            <span className="font-semibold text-sky-900">结论：</span>
            {data.summary.conclusion}
          </div>
        </div>
      ) : null}
    </div>
  );
}
