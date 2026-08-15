import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";
import { OfferEvaluator } from "@/components/OfferEvaluator";

export const metadata: Metadata = {
  title: "Evaluate an Offer — SalaryShift",
  description:
    "Find out whether an overseas job offer is actually better than your current salary.",
};

export default function OfferPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <OfferEvaluator />
      </main>
      <AppFooter />
    </>
  );
}
