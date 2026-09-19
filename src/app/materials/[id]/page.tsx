import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  KeyRound,
  Layers,
  ListChecks,
  CircleCheck,
} from "lucide-react";
import { getMaterial } from "@/lib/data";
import { SectionHeader, EmptyState } from "@/components/ui";
import { DeleteMaterialButton } from "@/components/widgets";

export const dynamic = "force-dynamic";

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = await getMaterial(Number(id));
  if (!m) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/materials" className="btn btn-ghost !text-xs">
          <ArrowLeft className="size-3.5" /> All materials
        </Link>
        <DeleteMaterialButton id={m.id} />
      </div>

      <header className="card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-volt-400/10 text-volt-400">
            <FileText className="size-6" />
          </span>
          <div className="min-w-0">
            <h1 className="display truncate text-2xl font-semibold text-ink-50 sm:text-3xl">{m.title}</h1>
            <p className="mt-1.5 font-mono text-[0.68rem] text-ink-400">
              {m.wordCount.toLocaleString()} words · ingested{" "}
              {new Date(m.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              {m.fileName ? ` · ${m.fileName}` : ""}
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-ink-800/50 px-4 py-3 text-center">
            <p className="display text-2xl font-bold text-volt-300">{m.counts.keyPoints}</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-400">key points</p>
          </div>
          <div className="rounded-xl bg-ink-800/50 px-4 py-3 text-center">
            <p className="display text-2xl font-bold text-vio-400">{m.counts.flashcards}</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-400">flashcards</p>
          </div>
          <div className="rounded-xl bg-ink-800/50 px-4 py-3 text-center">
            <p className="display text-2xl font-bold text-mint-400">{m.counts.questions}</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-400">questions</p>
          </div>
        </div>
      </header>

      {/* Key points */}
      <section>
        <SectionHeader eyebrow="Salience-ranked" title="Extracted key points" />
        {m.points.length === 0 ? (
          <EmptyState icon={<KeyRound className="size-7" />} title="No key points found" body="This document didn't yield ranked key points — it may be mostly question-formatted text." />
        ) : (
          <ul className="space-y-2.5">
            {m.points.map((p, i) => (
              <li key={i} className="card flex items-start gap-3 px-5 py-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-volt-400/10 font-mono text-[0.62rem] font-bold text-volt-300">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink-200">{p}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Flashcards */}
      <section>
        <SectionHeader eyebrow="Generated" title="Flashcards from this material" />
        {m.cards.length === 0 ? (
          <EmptyState icon={<Layers className="size-7" />} title="No flashcards generated" body="Try a document with clearer definitions or statements." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {m.cards.map((c, i) => (
              <div key={i} className="card p-5">
                <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-widest text-vio-400">Front</p>
                <p className="text-sm font-medium leading-relaxed text-ink-100">{c.front}</p>
                <div className="my-3 border-t border-dashed border-ink-600" />
                <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-widest text-mint-400">Back</p>
                <p className="text-sm leading-relaxed text-ink-300">{c.back}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Questions */}
      <section>
        <SectionHeader eyebrow="Generated / parsed" title="Questions from this material" />
        {m.qs.length === 0 ? (
          <EmptyState icon={<ListChecks className="size-7" />} title="No questions produced" body="Documents with definitions or numbered Q&A blocks produce the best question sets." />
        ) : (
          <div className="space-y-4">
            {m.qs.map((q, i) => (
              <div key={i} className="card p-5">
                <p className="text-sm font-semibold leading-relaxed text-ink-50">
                  <span className="mr-2 font-mono text-volt-300">Q{i + 1}.</span>
                  {q.prompt}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((o, oi) => (
                    <div
                      key={oi}
                      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                        oi === q.correctIndex
                          ? "border-mint-400/40 bg-mint-400/10 text-mint-200"
                          : "border-ink-700 text-ink-400"
                      }`}
                    >
                      {oi === q.correctIndex ? (
                        <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-mint-400" />
                      ) : (
                        <span className="mt-0.5 size-3.5 shrink-0 rounded-full border border-ink-600" />
                      )}
                      {o}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <p className="mt-3 rounded-lg bg-ink-800/50 px-3 py-2 text-xs leading-relaxed text-ink-300">
                    {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
