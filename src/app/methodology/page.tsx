import type { Metadata } from "next";
import { Database, ShieldCheck, Scale, Lock } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

export const metadata: Metadata = {
  title: "Methodology — SalaryShift",
  description:
    "How SalaryShift estimates equivalent salaries: data sources, calculation steps, confidence and limitations.",
};

export default function MethodologyPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-[760px] px-6 py-14">
          <h1 className="text-4xl font-extrabold tracking-tight text-fg">Methodology</h1>
          <p className="mt-4 text-lg text-fg-secondary leading-relaxed">
            Every estimate in this product combines a purchasing-power
            baseline with housing and lifestyle adjustments — calculated at
            the country level. This page explains how, what it&rsquo;s built
            on, and where it falls short.
          </p>

          <div className="mt-6 flex items-start gap-3 rounded-[16px] border border-warning-bg bg-warning-bg p-4">
            <ShieldCheck size={18} className="mt-1 shrink-0 text-warning" />
            <p className="text-base leading-relaxed">
              <strong>Estimates are calculated per country, not per city.</strong>{" "}
              Reliable, verifiable cost data isn&rsquo;t available for every
              city, so rather than show precise-looking city numbers we
              can&rsquo;t stand behind, this tool estimates using each
              country&rsquo;s national averages and labels every result as an
              estimate. PPP factors, cost indices and tax brackets are
              illustrative reference approximations, not a live feed from
              official statistical agencies — see{" "}
              <a href="#limitations" className="underline">
                Limitations
              </a>{" "}
              before using this to make a decision.
            </p>
          </div>

          <Section icon={Database} title="Data architecture">
            <dl className="space-y-4 text-base">
              <Item
                term="Economic PPP baseline"
                def="A country-level purchasing-power conversion factor, modeled on the structure of World Bank ICP / household consumption PPP data."
              />
              <Item
                term="Housing & living cost index"
                def="A relative cost index (New York = 100) covering housing and non-housing living costs at the national level, used for the optional cost-of-living breakdown."
              />
              <Item
                term="Lifestyle assumption"
                def="This version calculates against a Standard lifestyle tier by default — a balanced, typical urban spending profile. Essential, Comfortable and Premium tiers exist in the underlying model but aren't yet exposed as a control."
              />
              <Item
                term="Tax calculation"
                def="Simplified national income-tax brackets for a single filer, with no state/local tax, credits or deductions modeled."
              />
              <Item
                term="Exchange rates"
                def="A reference FX rate per currency, shown only to illustrate the difference between currency conversion and purchasing-power equivalence."
              />
            </dl>
          </Section>

          <Section icon={Scale} title="How a result is calculated">
            <ol className="space-y-4 text-base leading-relaxed list-decimal list-inside">
              <li>Convert your current income into international purchasing-power terms using your origin country&rsquo;s PPP factor.</li>
              <li>Convert that into a destination-country PPP-equivalent nominal salary — the PPP baseline.</li>
              <li>Adjust for the Standard lifestyle tier&rsquo;s effect on the housing share of the basket.</li>
              <li>Adjust for the Standard lifestyle tier&rsquo;s effect on the discretionary share of the basket.</li>
              <li>Sum the baseline and adjustments to produce your target salary.</li>
            </ol>
          </Section>

          <Section icon={ShieldCheck} title="Precision">
            <p className="text-base leading-relaxed">
              Numbers are rounded to a sensible precision for a financial
              decision (for example, the nearest 100 or 1,000 depending on
              magnitude) rather than shown with false decimal precision.
            </p>
          </Section>

          <Section icon={Lock} title="Privacy" id="privacy">
            <p className="text-base leading-relaxed">
              Every calculation runs in your browser. No account is required
              to use the salary comparison or offer evaluation tools, and no
              salary information is sent to or stored on a server by this
              build.
            </p>
          </Section>

          <Section icon={ShieldCheck} title="Limitations" id="limitations">
            <ul className="space-y-2 text-base leading-relaxed list-disc list-inside">
              <li>Estimates are calculated per country, not per city — actual costs can vary significantly between cities within the same country.</li>
              <li>Reference data is illustrative and does not reflect a live statistical or tax-authority feed.</li>
              <li>Tax estimates ignore state/local tax, deductions, credits and filing status — they are not tax advice.</li>
              <li>The product does not account for visa costs, relocation logistics, or employer-specific benefits beyond what you enter manually.</li>
            </ul>
          </Section>
        </div>
      </main>
      <AppFooter />
    </>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  id,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-fg">
        <Icon size={20} className="text-primary-600" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Item({ term, def }: { term: string; def: string }) {
  return (
    <div>
      <dt className="font-medium">{term}</dt>
      <dd className="text-fg-secondary">{def}</dd>
    </div>
  );
}
