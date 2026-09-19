import { getDueCards } from "@/lib/actions";
import { Deck } from "@/components/deck";
import { SectionHeader } from "@/components/ui";
import { Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain = "all" } = await searchParams;
  const cards = await getDueCards(25, domain);

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <SectionHeader
        eyebrow="Spaced repetition · SM-2"
        title="Flashcard review"
        right={
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-vio-400" />
            <span className="font-mono text-xs text-ink-300">{cards.length} cards loaded</span>
          </div>
        }
      />
      <p className="-mt-4 max-w-xl text-sm leading-relaxed text-ink-400">
        Rate yourself honestly — the algorithm schedules each card to return just before you would
        forget it. “Again” re-queues the card inside this session.
      </p>
      <Deck key={domain} initialCards={cards} domain={domain} />
    </div>
  );
}
