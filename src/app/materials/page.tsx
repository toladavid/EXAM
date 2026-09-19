import Link from "next/link";
import { FileText, KeyRound, Layers, ListChecks, ChevronRight, FolderUp } from "lucide-react";
import { getMaterials } from "@/lib/data";
import { SectionHeader, EmptyState } from "@/components/ui";
import { UploadBox } from "@/components/upload-box";
import { DeleteMaterialButton } from "@/components/widgets";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Knowledge base" title="Your study materials" />

      <UploadBox />

      <section>
        <SectionHeader
          eyebrow="Library"
          title={materials.length ? `${materials.length} material${materials.length === 1 ? "" : "s"} ingested` : "Ingested materials"}
        />
        {materials.length === 0 ? (
          <EmptyState
            icon={<FolderUp className="size-7" />}
            title="No materials yet"
            body="Upload your first document above. PILOT will extract key points, build flashcards, and generate practice questions from it — all kept in your private knowledge base."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {materials.map((m, i) => (
              <div
                key={m.id}
                className="card card-hover group animate-fade-up p-5"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-volt-400/10 text-volt-400">
                    <FileText className="size-5" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="chip !text-[0.6rem] uppercase">{m.kind}</span>
                    <DeleteMaterialButton id={m.id} />
                  </div>
                </div>
                <h3 className="display truncate text-lg font-semibold text-ink-50">{m.title}</h3>
                <p className="mt-1 font-mono text-[0.65rem] text-ink-400">
                  {m.wordCount.toLocaleString()} words · {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {m.fileName ? ` · ${m.fileName.slice(0, 28)}` : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[0.68rem]">
                  <span className="flex items-center gap-1.5 rounded-lg bg-ink-700/50 px-2.5 py-1.5 text-ink-300">
                    <KeyRound className="size-3 text-volt-400" /> {m.counts.keyPoints} key points
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-ink-700/50 px-2.5 py-1.5 text-ink-300">
                    <Layers className="size-3 text-vio-400" /> {m.counts.flashcards} cards
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg bg-ink-700/50 px-2.5 py-1.5 text-ink-300">
                    <ListChecks className="size-3 text-mint-400" /> {m.counts.questions} questions
                  </span>
                </div>
                <Link
                  href={`/materials/${m.id}`}
                  className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-volt-300 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Inspect extraction <ChevronRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
