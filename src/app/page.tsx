import Link from "next/link";
import {
  Flame,
  Layers,
  Crosshair,
  Timer,
  FolderUp,
  BookOpen,
  Clock3,
  Target,
  Sparkles,
  ArrowRight,
  CalendarDays,
  RefreshCcw,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import { getDashboard } from "@/lib/data";
import { ProgressRing, MasteryRadar, WeekBars } from "@/components/charts";
import { StatCard, SectionHeader, DomainBadge, DomainWeightStrip } from "@/components/ui";
import { TaskToggle } from "@/components/widgets";
import clsx from "clsx";

export const dynamic = "force-dynamic";

const KIND_META: Record<string, { icon: typeof BookOpen; color: string }> = {
  reading: { icon: BookOpen, color: "#4DD7FD" },
  flashcard: { icon: Layers, color: "#A78BFA" },
  quiz: { icon: Crosshair, color: "#34D399" },
  focus: { icon: Timer, color: "#FBBF24" },
  review: { icon: RefreshCcw, color: "#8d97b0" },
  mock: { icon: GraduationCap, color: "#F472B6" },
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function Dashboard() {
  const data = await getDashboard();
  const p = data.profile;
  const noPlan = data.planTotal === 0;

  return (
    <div className="space-y-8">
      {/* ── Hero header ── */}
      <header className="animate-fade-up flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="display text-4xl font-semibold tracking-tight text-ink-50 sm:text-5xl">
            {greeting()}, <span className="shimmer-text">{p?.name ?? "Candidate"}</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-300">
            {data.daysLeft !== null
              ? data.daysLeft > 0
                ? `Your CISA exam is in ${data.daysLeft} day${data.daysLeft === 1 ? "" : "s"}. The plan knows what matters — trust the process.`
                : "Exam day. Skim lightly, breathe deeply, execute."
              : "Set your exam date and PILOT will architect a day-by-day study system around it."}
          </p>
        </div>

        {data.daysLeft !== null && data.daysLeft >= 0 && (
          <div className="card flex items-center gap-5 px-6 py-4">
            <CalendarDays className="size-8 text-volt-400" />
            <div>
              <p className="display text-4xl font-bold leading-none text-ink-50">{data.daysLeft}</p>
              <p className="eyebrow mt-1 !text-[0.55rem]">days until exam</p>
            </div>
            {data.daysLeft <= 30 && (
              <span className="chip !border-ember-400/40 !bg-ember-400/10 !text-ember-300">
                Final stretch
              </span>
            )}
          </div>
        )}
      </header>

      {/* ── Setup banner ── */}
      {(noPlan || data.needsSetup) && (
        <div className="card animate-scale-in relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 size-56 rounded-full bg-volt-400/10 blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="max-w-lg">
              <p className="eyebrow mb-2 flex items-center gap-2 !text-volt-300">
                <Sparkles className="size-3.5" /> Mission setup
              </p>
              <h2 className="display text-2xl font-semibold text-ink-50">
                Architect your study system in 60 seconds
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Tell PILOT your exam date and available time per day. It will schedule spaced
                reading, interleaved quizzing, flashcard reviews, and focus blocks — then track
                your mastery across all five domains.
              </p>
            </div>
            <Link href="/onboarding" className="btn btn-volt !px-6 !py-3 !text-base">
              Configure my plan <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Quick actions ── */}
      <div className="stagger grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Link href="/focus" className="card card-hover group p-5">
          <Timer className="mb-4 size-6 text-ember-400 transition-transform duration-300 group-hover:scale-110" />
          <p className="text-sm font-semibold text-ink-50">Focus Block</p>
          <p className="mt-0.5 text-xs text-ink-400">25-min pomodoro</p>
        </Link>
        <Link href="/study" className="card card-hover group p-5">
          <Layers className="mb-4 size-6 text-vio-400 transition-transform duration-300 group-hover:scale-110" />
          <p className="text-sm font-semibold text-ink-50">
            Review Cards {data.dueCards > 0 && <span className="text-vio-400">· {data.dueCards}</span>}
          </p>
          <p className="mt-0.5 text-xs text-ink-400">spaced repetition</p>
        </Link>
        <Link href="/quiz" className="card card-hover group p-5">
          <Crosshair className="mb-4 size-6 text-mint-400 transition-transform duration-300 group-hover:scale-110" />
          <p className="text-sm font-semibold text-ink-50">Take a Quiz</p>
          <p className="mt-0.5 text-xs text-ink-400">active retrieval</p>
        </Link>
        <Link href="/materials" className="card card-hover group p-5">
          <FolderUp className="mb-4 size-6 text-volt-400 transition-transform duration-300 group-hover:scale-110" />
          <p className="text-sm font-semibold text-ink-50">Add Material</p>
          <p className="mt-0.5 text-xs text-ink-400">mine your notes</p>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Left column ── */}
        <div className="space-y-6 lg:col-span-3">
          {/* Today's plan */}
          <section className="card animate-fade-up p-6" style={{ animationDelay: "0.1s" }}>
            <SectionHeader
              eyebrow="Today's protocol"
              title={
                data.todayTasks.length
                  ? `${data.todayDone}/${data.todayTasks.length} tasks complete`
                  : "Nothing scheduled today"
              }
              right={
                !noPlan && (
                  <Link href="/plan" className="btn btn-ghost !py-2 !text-xs">
                    Full plan <ArrowRight className="size-3.5" />
                  </Link>
                )
              }
            />
            {data.todayTasks.length === 0 ? (
              <p className="text-sm text-ink-400">
                {noPlan
                  ? "Generate your plan to see a daily protocol here."
                  : "Rest day or plan gap — use quick actions above to keep the streak alive."}
              </p>
            ) : (
              <ul className="space-y-2.5">
                {data.todayTasks.map((t) => {
                  const meta = KIND_META[t.kind] ?? KIND_META.review;
                  return (
                    <li
                      key={t.id}
                      className={clsx(
                        "flex items-center gap-3.5 rounded-xl border px-4 py-3 transition-all duration-300",
                        t.done
                          ? "border-mint-400/20 bg-mint-400/5"
                          : "border-ink-700 bg-ink-800/40 hover:border-ink-600"
                      )}
                    >
                      <TaskToggle id={t.id} done={t.done} />
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-lg"
                        style={{ background: `${meta.color}14`, color: meta.color }}
                      >
                        <meta.icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={clsx(
                            "truncate text-sm font-medium",
                            t.done ? "text-ink-400 line-through" : "text-ink-100"
                          )}
                        >
                          {t.label}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-[0.62rem] text-ink-400">
                            ~{t.estMinutes} min
                          </span>
                          {t.domain && <DomainBadge domain={t.domain} />}
                        </div>
                      </div>
                      {t.href && !t.done && (
                        <Link
                          href={t.href}
                          className="grid size-8 shrink-0 place-items-center rounded-lg border border-ink-600 text-ink-300 transition-colors hover:border-volt-400 hover:text-volt-300"
                          title="Start now"
                        >
                          <ArrowRight className="size-4" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Weekly minutes */}
          <section className="card animate-fade-up p-6" style={{ animationDelay: "0.18s" }}>
            <SectionHeader
              eyebrow="Consistency"
              title="Study minutes this week"
              right={<span className="chip">{data.totalMinutes} min total</span>}
            />
            <WeekBars data={data.weekMinutes} />
          </section>

          {/* Tip of the day */}
          <section
            className="card animate-fade-up flex items-start gap-4 p-6"
            style={{ animationDelay: "0.26s" }}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ember-400/10 text-ember-400">
              <Lightbulb className="size-5" />
            </span>
            <div>
              <p className="eyebrow mb-1.5 !text-ember-300">Learning science · tip of the day</p>
              <p className="text-sm leading-relaxed text-ink-200">{data.tip}</p>
            </div>
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Level & streak */}
          <section className="card animate-fade-up p-6" style={{ animationDelay: "0.14s" }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <ProgressRing pct={data.level.pct} size={86} color="#4DD7FD">
                  <div className="text-center">
                    <p className="display text-2xl font-bold text-ink-50">{data.level.level}</p>
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-400">level</p>
                  </div>
                </ProgressRing>
                <div>
                  <p className="display text-lg font-semibold text-ink-50">{p?.xp ?? 0} XP</p>
                  <p className="text-xs text-ink-400">
                    {data.level.need - data.level.into} XP to level {data.level.level + 1}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <Flame
                      className={clsx("size-4", (p?.streak ?? 0) > 0 ? "text-ember-400" : "text-ink-500")}
                    />
                    <span className="text-sm font-semibold text-ink-100">{p?.streak ?? 0}-day streak</span>
                    {(p?.bestStreak ?? 0) > 0 && (
                      <span className="font-mono text-[0.6rem] text-ink-400">best {p?.bestStreak}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {data.planTotal > 0 && (
              <div className="mt-5 border-t border-ink-700/60 pt-4">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium text-ink-300">Plan execution</span>
                  <span className="font-mono text-ink-200">
                    {Math.round((data.planDone / Math.max(1, data.planTotal)) * 100)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-volt-500 to-mint-400 transition-all duration-700"
                    style={{ width: `${(data.planDone / Math.max(1, data.planTotal)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Domain mastery */}
          <section className="card animate-fade-up p-6" style={{ animationDelay: "0.22s" }}>
            <SectionHeader eyebrow="Mastery" title="Domain accuracy" />
            <div className="flex flex-col items-center gap-4">
              <MasteryRadar mastery={data.mastery} />
              <DomainWeightStrip />
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-1.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const m = data.mastery[String(n)];
                  return (
                    <div key={n} className="flex items-center justify-between font-mono text-[0.65rem]">
                      <span className="text-ink-400">D{n}</span>
                      <span className={m && m.total > 0 ? "text-ink-100" : "text-ink-500"}>
                        {m && m.total > 0 ? `${Math.round((m.correct / m.total) * 100)}%` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Arsenal stats */}
          <div className="stagger grid grid-cols-2 gap-3">
            <StatCard
              icon={<Target className="size-4" />}
              label="Avg. quiz accuracy"
              value={data.quizCount > 0 ? `${data.avgAccuracy}%` : "—"}
              sub={data.quizCount > 0 ? `${data.quizCount} sessions` : "no quizzes yet"}
              accent="#34D399"
            />
            <StatCard
              icon={<Clock3 className="size-4" />}
              label="Question bank"
              value={String(data.questionCount)}
              sub={data.questionMine > 0 ? `+${data.questionMine} from your materials` : `${data.questionCore} core CISA`}
              accent="#4DD7FD"
            />
            <StatCard
              icon={<Layers className="size-4" />}
              label="Flashcards due"
              value={String(data.dueCards)}
              accent="#A78BFA"
            />
            <StatCard
              icon={<FolderUp className="size-4" />}
              label="Materials uploaded"
              value={String(data.materialCount)}
              accent="#FBBF24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
