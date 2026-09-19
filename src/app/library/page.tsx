import { getLibrary } from "@/lib/data";
import { DOMAINS } from "@/lib/cisa-content";
import { SectionHeader, EmptyState, DomainWeightStrip } from "@/components/ui";
import { BookOpen, ChevronRight, FolderUp, KeyRound } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;
  const { core, mine } = await getLibrary();

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Key points library"
        title="Core knowledge, distilled"
        right={
          <Link href="/materials" className="btn btn-ghost !text-xs">
            <FolderUp className="size-3.5" /> Add your materials
          </Link>
        }
      />

      <div className="card p-6">
        <DomainWeightStrip />
        <p className="mt-3 text-xs text-ink-400">
          The CISA blueprint tilts heavily toward Domains 4 and 5 (52% of the exam combined). Your
          plan weights reading time accordingly — the strip above shows official exam weights.
        </p>
      </div>

      <div className="space-y-4">
        {DOMAINS.map((d, di) => {
          const points = core[d.id] ?? [];
          const open = domain ? domain === d.id : di === 4; // default open: D5 (heaviest with D4)
          return (
            <details key={d.id} className="acc card overflow-hidden" open={open}>
              <summary className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink-800/40">
                <ChevronRight className="acc-chevron size-4 shrink-0 text-ink-400" />
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-xl font-mono text-sm font-bold"
                  style={{ background: `${d.color}1a`, color: d.color }}
                >
                  D{d.id}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-50">{d.name}</p>
                  <p className="truncate text-xs text-ink-400">{d.blurb}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="chip !text-[0.6rem]">{points.length} points</span>
                  <span className="chip !text-[0.6rem]" style={{ color: d.color }}>
                    {d.weight}%
                  </span>
                </div>
              </summary>
              <ul className="space-y-2 border-t border-ink-700/60 px-5 py-5">
                {points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl bg-ink-800/30 px-4 py-3">
                    <KeyRound className="mt-0.5 size-3.5 shrink-0" style={{ color: d.color }} />
                    <p className="text-sm leading-relaxed text-ink-200">{p}</p>
                  </li>
                ))}
                {points.length === 0 && (
                  <li className="px-2 py-4 text-sm text-ink-500">No key points yet.</li>
                )}
              </ul>
            </details>
          );
        })}
      </div>

      {/* From your materials */}
      <section>
        <SectionHeader eyebrow="Extracted by PILOT" title="From your materials" />
        {mine.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="size-7" />}
            title="Nothing extracted yet"
            body="Upload study notes, review manuals, or past-question papers — PILOT will mine them for key points, flashcards, and questions automatically."
            action={
              <Link href="/materials" className="btn btn-volt">
                Upload material
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {mine.map((m) => (
              <details key={m.materialId} className="acc card overflow-hidden">
                <summary className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-ink-800/40">
                  <ChevronRight className="acc-chevron size-4 shrink-0 text-ink-400" />
                  <span className="chip !border-vio-400/40 !bg-vio-400/10 !text-vio-400">YOURS</span>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-50">{m.title}</p>
                  <span className="chip shrink-0 !text-[0.6rem]">{m.points.length} points</span>
                </summary>
                <ul className="space-y-2 border-t border-ink-700/60 px-5 py-5">
                  {m.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-xl bg-ink-800/30 px-4 py-3">
                      <KeyRound className="mt-0.5 size-3.5 shrink-0 text-vio-400" />
                      <p className="text-sm leading-relaxed text-ink-200">{p}</p>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
