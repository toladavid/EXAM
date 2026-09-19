import Link from "next/link";
import { CalendarCheck, BookOpen, Layers, Crosshair, Timer, RefreshCcw, GraduationCap, Settings2 } from "lucide-react";
import { getPlan } from "@/lib/data";
import { addDaysISO, todayISO } from "@/lib/study-engine";
import { SectionHeader, DomainBadge, EmptyState } from "@/components/ui";
import { TaskToggle, RegeneratePlanButton } from "@/components/widgets";
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

const PHASES: { name: string; test: (dayFrac: number) => boolean; hint: string }[] = [
  { name: "Foundation", test: (f) => f < 0.55, hint: "Learn the key points, build your deck" },
  { name: "Practice", test: (f) => f < 0.82, hint: "Interleaved quizzing & retrieval" },
  { name: "Peak", test: () => true, hint: "Mocks, weak areas, final review" },
];

export default async function PlanPage() {
  const { profile, tasks, daysLeft } = await getPlan();
  const today = todayISO();

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader eyebrow="Study plan" title="Your roadmap" />
        <EmptyState
          icon={<CalendarCheck className="size-7" />}
          title="No plan yet"
          body="Tell PILOT your exam date and it'll generate a spaced, interleaved, day-by-day protocol across all five domains."
          action={
            <Link href="/onboarding" className="btn btn-volt">
              Configure my plan
            </Link>
          }
        />
      </div>
    );
  }

  const doneCount = tasks.filter((t) => t.done).length;
  const examDate = profile?.examDate ?? today;

  // group tasks by week (weeks starting today)
  const weeks: { label: string; start: string; end: string; tasks: typeof tasks }[] = [];
  const first = tasks[0].date;
  const bucketSize = 7;
  for (const t of tasks) {
    const dayIdx = Math.max(
      0,
      Math.round(
        (new Date(t.date + "T00:00:00Z").getTime() - new Date(first + "T00:00:00Z").getTime()) / 86400000
      )
    );
    const wIdx = Math.floor(dayIdx / bucketSize);
    if (!weeks[wIdx]) {
      const start = addDaysISO(first, wIdx * bucketSize);
      weeks[wIdx] = {
        label: `Week ${wIdx + 1}`,
        start,
        end: addDaysISO(start, 6),
        tasks: [],
      };
    }
    weeks[wIdx].tasks.push(t);
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Study plan"
        title={daysLeft !== null ? `${daysLeft} days to CISA` : "Your roadmap"}
        right={
          <div className="flex flex-wrap gap-2">
            <Link href="/onboarding" className="btn btn-ghost !text-xs">
              <Settings2 className="size-3.5" /> Edit setup
            </Link>
            <RegeneratePlanButton />
          </div>
        }
      />

      {/* Progress + phases */}
      <div className="card p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-ink-200">
            {doneCount} of {tasks.length} tasks complete
          </p>
          <p className="font-mono text-xs text-ink-400">
            {first} → {examDate}
          </p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-volt-500 via-mint-400 to-mint-300 transition-all duration-700"
            style={{ width: `${(doneCount / tasks.length) * 100}%` }}
          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PHASES.map((ph) => {
            const total = tasks.length;
            const allDays = Math.max(
              1,
              Math.round(
                (new Date(examDate + "T00:00:00Z").getTime() - new Date(first + "T00:00:00Z").getTime()) / 86400000
              )
            );
            const elapsed = Math.round(
              (new Date(today + "T00:00:00Z").getTime() - new Date(first + "T00:00:00Z").getTime()) / 86400000
            );
            const active = ph.test(Math.max(0, Math.min(1, elapsed / allDays)));
            return (
              <div
                key={ph.name}
                className={clsx(
                  "rounded-xl border px-4 py-3",
                  active ? "border-volt-400/40 bg-volt-400/5" : "border-ink-700 opacity-50"
                )}
              >
                <p className="flex items-center gap-2 text-sm font-semibold text-ink-100">
                  {ph.name}
                  {active && <span className="size-1.5 animate-pulse-soft rounded-full bg-volt-400" />}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">{ph.hint}</p>
                <p className="hidden">{total}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weeks */}
      <div className="space-y-8">
        {weeks.map((w) => {
          const wDone = w.tasks.filter((t) => t.done).length;
          const isCurrent = today >= w.start && today <= w.end;
          const isPast = today > w.end;
          return (
            <section key={w.label} className={clsx(isPast && "opacity-60")}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className={clsx("display text-lg font-semibold", isCurrent ? "text-volt-300" : "text-ink-100")}>
                  {w.label}
                </h3>
                <span className="font-mono text-[0.65rem] text-ink-400">
                  {w.start} — {w.end}
                </span>
                <span className="chip !text-[0.6rem]">
                  {wDone}/{w.tasks.length}
                </span>
                {isCurrent && <span className="size-1.5 animate-pulse-soft rounded-full bg-volt-400" />}
              </div>
              <ul className="space-y-2">
                {w.tasks.map((t) => {
                  const meta = KIND_META[t.kind] ?? KIND_META.review;
                  const isToday = t.date === today;
                  return (
                    <li
                      key={t.id}
                      className={clsx(
                        "flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors",
                        isToday
                          ? "border-volt-400/40 bg-volt-400/5"
                          : t.done
                            ? "border-ink-700/60 bg-ink-900/40"
                            : "border-ink-700 bg-ink-800/30"
                      )}
                    >
                      <TaskToggle id={t.id} done={t.done} />
                      <span className="w-14 shrink-0 font-mono text-[0.65rem] text-ink-400">
                        {t.date.slice(5)}
                        {isToday && <span className="block !text-[0.55rem] text-volt-300">TODAY</span>}
                      </span>
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-lg"
                        style={{ background: `${meta.color}14`, color: meta.color }}
                      >
                        <meta.icon className="size-3.5" />
                      </span>
                      <p
                        className={clsx(
                          "min-w-0 flex-1 truncate text-sm",
                          t.done ? "text-ink-500 line-through" : "text-ink-200"
                        )}
                      >
                        {t.label}
                      </p>
                      <div className="hidden shrink-0 items-center gap-2 sm:flex">
                        {t.domain && <DomainBadge domain={t.domain} />}
                        <span className="font-mono text-[0.62rem] text-ink-500">~{t.estMinutes}m</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
