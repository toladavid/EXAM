import Link from "next/link";
import {
  Crosshair,
  Clock3,
  Layers,
  FolderUp,
  AlertTriangle,
  TrendingUp,
  History,
  ArrowRight,
} from "lucide-react";
import { getStats } from "@/lib/data";
import { DOMAINS } from "@/lib/cisa-content";
import { SectionHeader, StatCard, EmptyState } from "@/components/ui";
import { MasteryRadar, WeekBars, AccuracyTrend } from "@/components/charts";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const s = await getStats();
  const accuracyPoints = [...s.quizHistory]
    .reverse()
    .map((q) => (q.total > 0 ? Math.round((q.correct / q.total) * 100) : 0));

  const weakest = DOMAINS.map((d) => {
    const m = s.mastery[d.id];
    return {
      ...d,
      attempts: m?.total ?? 0,
      pct: m && m.total > 0 ? Math.round((m.correct / m.total) * 100) : null,
    };
  })
    .filter((d) => d.attempts >= 5 && d.pct !== null)
    .sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0))
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Insights" title="Evidence of progress" />

      {/* Top stats */}
      <div className="stagger grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Crosshair className="size-4" />}
          label="Questions answered"
          value={String(s.totals.questionsAnswered)}
          sub={`${s.totals.quizzes} quiz sessions`}
          accent="#34D399"
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          label="Overall accuracy"
          value={s.totals.questionsAnswered > 0 ? `${s.totals.accuracy}%` : "—"}
          sub="target: 80%+ before exam day"
          accent="#4DD7FD"
        />
        <StatCard
          icon={<Clock3 className="size-4" />}
          label="Time invested"
          value={`${(s.totals.minutes / 60).toFixed(1)}h`}
          accent="#FBBF24"
        />
        <StatCard
          icon={<Layers className="size-4" />}
          label="Cards mastered"
          value={String(s.cards.mastered)}
          sub={`${s.cards.learning} learning · ${s.cards.due} due`}
          accent="#A78BFA"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar */}
        <section className="card flex flex-col items-center p-6">
          <SectionHeader eyebrow="Domain mastery" title="Accuracy by domain" />
          <MasteryRadar mastery={s.mastery} size={300} />
          <div className="mt-2 grid w-full grid-cols-1 gap-2">
            {DOMAINS.map((d) => {
              const m = s.mastery[d.id];
              const pct = m && m.total > 0 ? Math.round((m.correct / m.total) * 100) : null;
              return (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="w-6 font-mono text-[0.65rem]" style={{ color: d.color }}>D{d.id}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct ?? 0}%`, background: d.color }}
                    />
                  </div>
                  <span className={clsx("w-16 text-right font-mono text-[0.65rem]", pct === null ? "text-ink-500" : "text-ink-100")}>
                    {pct === null ? "no data" : `${pct}% · ${m!.total}q`}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="space-y-6">
          {/* Accuracy trend */}
          <section className="card p-6">
            <SectionHeader eyebrow="Trajectory" title="Accuracy trend" />
            <AccuracyTrend points={accuracyPoints} />
          </section>

          {/* Weak areas */}
          <section className="card p-6">
            <SectionHeader eyebrow="Diagnosis" title="Weakest domains" />
            {weakest.length === 0 ? (
              <p className="text-sm leading-relaxed text-ink-400">
                Answer at least 5 questions in any domain and PILOT will surface your weakest links
                here — then point your practice at them.
              </p>
            ) : (
              <ul className="space-y-3">
                {weakest.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center gap-4 rounded-xl border border-ember-400/25 bg-ember-400/5 px-4 py-3"
                  >
                    <AlertTriangle className="size-5 shrink-0 text-ember-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-100">
                        D{d.id} — {d.name}
                      </p>
                      <p className="font-mono text-[0.65rem] text-ember-300">
                        {d.pct}% over {d.attempts} questions
                      </p>
                    </div>
                    <Link href={`/quiz?domain=${d.id}&count=15&autostart=1`} className="btn btn-ghost !py-2 !text-xs">
                      Attack <ArrowRight className="size-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Weekly minutes */}
          <section className="card p-6">
            <SectionHeader eyebrow="Consistency" title="This week's minutes" />
            <WeekBars data={s.weekMinutes} height={100} />
          </section>
        </div>
      </div>

      {/* Quiz history */}
      <section>
        <SectionHeader eyebrow="Log" title="Recent quiz sessions" />
        {s.quizHistory.length === 0 ? (
          <EmptyState
            icon={<History className="size-7" />}
            title="No sessions yet"
            body="Your quiz history will appear here with scores, pace, and mode — the raw material of your accuracy trend."
            action={<Link href="/quiz" className="btn btn-volt">Take your first quiz</Link>}
          />
        ) : (
          <div className="card divide-y divide-ink-700/60">
            {s.quizHistory.map((q) => {
              const pct = q.total > 0 ? Math.round((q.correct / q.total) * 100) : 0;
              return (
                <div key={q.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span
                    className={clsx(
                      "grid size-9 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold",
                      pct >= 70 ? "bg-mint-400/10 text-mint-400" : pct >= 50 ? "bg-ember-400/10 text-ember-400" : "bg-rose-400/10 text-rose-400"
                    )}
                  >
                    {pct}%
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-100">
                      {q.correct}/{q.total} correct
                    </p>
                    <p className="font-mono text-[0.65rem] text-ink-400">
                      {new Date(q.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ·{" "}
                      {Math.floor(q.durationSec / 60)}m {q.durationSec % 60}s
                    </p>
                  </div>
                  <span className={clsx("chip !text-[0.6rem]", q.mode === "exam" && "!text-d5")}>
                    {q.mode.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Knowledge base summary */}
      <section className="card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-11 place-items-center rounded-xl bg-ember-400/10 text-ember-400">
            <FolderUp className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-50">
              {s.materials} material{s.materials === 1 ? "" : "s"} powering your question bank
            </p>
            <p className="text-xs text-ink-400">
              Personal questions you only see — keep feeding the engine.
            </p>
          </div>
        </div>
        <Link href="/materials" className="btn btn-ghost !text-xs">
          Manage materials <ArrowRight className="size-3.5" />
        </Link>
      </section>
    </div>
  );
}
