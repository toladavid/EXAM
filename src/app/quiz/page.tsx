import { Suspense } from "react";
import { QuizRunner } from "@/components/quiz-runner";
import { SectionHeader } from "@/components/ui";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function QuizPage() {
  return (
    <div className="space-y-7">
      <SectionHeader eyebrow="Quiz lab" title="Train like you test" />
      <Suspense
        fallback={
          <div className="grid place-items-center py-20 text-ink-400">
            <Loader2 className="size-6 animate-spin" />
          </div>
        }
      >
        <QuizRunner />
      </Suspense>
    </div>
  );
}
