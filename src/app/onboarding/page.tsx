import { OnboardingForm } from "@/components/onboarding-form";
import { getPlan } from "@/lib/data";
import { Rocket } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { profile } = await getPlan();
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 text-center">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-volt-400 to-volt-600 text-ink-950 shadow-[0_0_40px_-6px_rgba(77,215,253,0.6)]">
          <Rocket className="size-7" />
        </span>
        <p className="eyebrow mb-2">Mission configuration</p>
        <h1 className="display text-4xl font-semibold text-ink-50">Build your study system</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-300">
          PILOT will schedule your entire prep — spaced reading, interleaved quizzes, flashcard
          reviews, and recovery days — around your exam date and daily availability.
        </p>
      </header>
      <OnboardingForm
        initial={{
          name: profile?.name ?? "",
          examDate: profile?.examDate ?? "",
          dailyMinutes: profile?.dailyMinutes ?? 60,
          focusDomains: profile?.focusDomains?.length ? profile.focusDomains : ["1", "2", "3", "4", "5"],
          experience: profile?.experience ?? "working",
        }}
      />
    </div>
  );
}
