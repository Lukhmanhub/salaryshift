"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CountrySelect } from "@/components/CountrySelect";
import { CurrencyInput } from "@/components/CurrencyInput";
import { SalaryRangeBar } from "@/components/SalaryRangeBar";
import { getCountry } from "@/lib/data/countries";
import { computeComparison, estimateOfferScore } from "@/lib/calculations";
import { formatMoney, formatPercent } from "@/lib/format";
import type { Country } from "@/lib/types";

// Assumed share of the target equivalent salary that goes to housing —
// used only to estimate housing affordability, since no city-level rent
// data is available at country granularity.
const EXPECTED_HOUSING_SHARE = 0.3;

export function OfferEvaluator() {
  const [currentCountry, setCurrentCountry] = useState<Country>(getCountry("IN"));
  const [currentSalaryMonthly, setCurrentSalaryMonthly] = useState(0);

  const [offerCountry, setOfferCountry] = useState<Country>(getCountry("AE"));
  const [offerBaseMonthly, setOfferBaseMonthly] = useState(0);
  const [offerBonusAnnual, setOfferBonusAnnual] = useState(0);
  const [housingAllowanceMonthly, setHousingAllowanceMonthly] = useState(0);
  const [otherAllowancesMonthly, setOtherAllowancesMonthly] = useState(0);

  const hasValidInputs = currentSalaryMonthly > 0 && offerBaseMonthly > 0;

  const comparison = useMemo(
    () =>
      computeComparison({
        fromCountry: currentCountry,
        toCountry: offerCountry,
        currentSalaryMonthly,
      }),
    [currentCountry, offerCountry, currentSalaryMonthly]
  );

  const offerTotalCompMonthly =
    offerBaseMonthly +
    offerBonusAnnual / 12 +
    housingAllowanceMonthly +
    otherAllowancesMonthly;

  // Current salary converted to the offer's currency at market exchange
  // rates, so it's compared against the offer in the same currency.
  const currentTotalCompMonthly = comparison.fxEquivalentMonthly;

  const expectedHousingMonthly = comparison.range.equivalent * EXPECTED_HOUSING_SHARE;
  // Without a disclosed housing allowance, assume the base salary covers
  // roughly 60% of typical housing costs — a conservative placeholder ratio.
  const housingAffordabilityRatio =
    housingAllowanceMonthly > 0
      ? Math.min(housingAllowanceMonthly / expectedHousingMonthly, 1.5)
      : 0.6;

  const score = useMemo(
    () =>
      estimateOfferScore({
        currentTotalCompMonthly,
        offerTotalCompMonthly,
        targetEquivalentMonthly: comparison.range.equivalent,
        targetComfortableMonthly: comparison.range.comfortable,
        housingAffordabilityRatio,
      }),
    [
      currentTotalCompMonthly,
      offerTotalCompMonthly,
      comparison.range.equivalent,
      comparison.range.comfortable,
      housingAffordabilityRatio,
    ]
  );

  const pctVsEquivalent =
    ((offerTotalCompMonthly - comparison.range.equivalent) /
      comparison.range.equivalent) *
    100;

  const verdict =
    score.overall >= 75
      ? "Financially Strong"
      : score.overall >= 55
      ? "Financially Reasonable"
      : score.overall >= 35
      ? "Below Target"
      : "Financially Weak";

  const shortfall = Math.max(0, expectedHousingMonthly - housingAllowanceMonthly);

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-14">
      <div className="mx-auto max-w-2xl text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg">
          Is your overseas offer actually good?
        </h1>
        <p className="mt-3 text-lg text-fg-secondary">
          Compare your current compensation against an offer, adjusted for
          purchasing power, housing and benefits.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-border-subtle bg-surface p-6 sm:p-8">
          <h2 className="mb-5 text-lg font-semibold">Current situation</h2>
          <div className="space-y-5">
            <CountrySelect
              label="Current location"
              value={currentCountry}
              onChange={setCurrentCountry}
              excludeCode={offerCountry.code}
            />
            <CurrencyInput
              label="Current salary (monthly)"
              symbol={currentCountry.currencySymbol}
              value={currentSalaryMonthly}
              onChange={setCurrentSalaryMonthly}
              placeholder="100,000"
            />
          </div>
        </div>

        <div className="rounded-[24px] border border-border-subtle bg-surface p-6 sm:p-8">
          <h2 className="mb-5 text-lg font-semibold">Job offer</h2>
          <div className="space-y-5">
            <CountrySelect
              label="Destination"
              value={offerCountry}
              onChange={setOfferCountry}
              excludeCode={currentCountry.code}
            />
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput
                label="Base salary (monthly)"
                symbol={offerCountry.currencySymbol}
                value={offerBaseMonthly}
                onChange={setOfferBaseMonthly}
                placeholder="10,000"
              />
              <CurrencyInput
                label="Bonus (annual)"
                symbol={offerCountry.currencySymbol}
                value={offerBonusAnnual}
                onChange={setOfferBonusAnnual}
              />
              <CurrencyInput
                label="Housing allowance (monthly)"
                symbol={offerCountry.currencySymbol}
                value={housingAllowanceMonthly}
                onChange={setHousingAllowanceMonthly}
              />
              <CurrencyInput
                label="Other allowances (monthly)"
                symbol={offerCountry.currencySymbol}
                value={otherAllowancesMonthly}
                onChange={setOtherAllowancesMonthly}
              />
            </div>
          </div>
        </div>
      </div>

      {hasValidInputs ? (
        <>
          {/* Offer score */}
          <div className="mt-8 rounded-[24px] border border-border-subtle bg-surface p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-fg-secondary">Your Offer Score</p>
                <p className="mt-2 text-6xl font-semibold tabular-nums">
                  {score.overall}
                  <span className="text-2xl text-fg-muted"> / 100</span>
                </p>
                <p className="mt-2 flex items-center gap-2 text-lg font-medium">
                  {pctVsEquivalent >= 0 ? (
                    <TrendingUp size={18} className="text-success" />
                  ) : (
                    <TrendingDown size={18} className="text-critical" />
                  )}
                  {verdict}
                </p>
              </div>
              <div className="grid flex-1 min-w-64 grid-cols-2 gap-4 sm:grid-cols-3">
                <ScoreBar label="Purchasing Power" value={score.components.purchasingPower} />
                <ScoreBar label="Take-home Pay" value={score.components.takeHome} />
                <ScoreBar label="Housing Affordability" value={score.components.housing} />
                <ScoreBar label="Savings Potential" value={score.components.savings} />
                <ScoreBar label="Benefits" value={score.components.benefits} />
              </div>
            </div>

            <p className="mt-6 text-base leading-relaxed text-fg-secondary">
              This offer appears{" "}
              <strong>
                {pctVsEquivalent >= 0 ? "stronger" : "weaker"}
              </strong>{" "}
              than a lifestyle-equivalent salary, at approximately{" "}
              <strong>{formatPercent(pctVsEquivalent, { showSign: true })}</strong>{" "}
              relative to our estimate of{" "}
              {formatMoney(comparison.range.equivalent, comparison.toCountry)}/month.
            </p>
          </div>

          <div className="mt-8 rounded-[24px] border border-border-subtle bg-surface p-6 sm:p-8">
            <h2 className="mb-5 text-lg font-semibold">Your negotiation range</h2>
            <SalaryRangeBar
              range={comparison.range}
              country={comparison.toCountry}
              marker={{ label: "Your offer", value: offerTotalCompMonthly }}
            />
          </div>

          <div className="mt-8 space-y-3">
            <InsightRow>
              Your offer is approximately{" "}
              {formatPercent(Math.abs(pctVsEquivalent))}{" "}
              {pctVsEquivalent >= 0 ? "above" : "below"} our lifestyle-equivalent
              salary estimate.
            </InsightRow>
            {shortfall > 0 && (
              <InsightRow>
                Housing is a major variable. If your housing costs exceed{" "}
                {formatMoney(expectedHousingMonthly, comparison.toCountry)}/month,
                most of your expected financial improvement may disappear.
              </InsightRow>
            )}
            {shortfall > 0 && (
              <InsightRow>
                A {formatMoney(shortfall, comparison.toCountry)} housing
                allowance would materially improve this package.
              </InsightRow>
            )}
            <InsightRow>
              To preserve your current standard of living, target at least{" "}
              {formatMoney(comparison.range.equivalent, comparison.toCountry)}
              /month in total compensation.
            </InsightRow>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-[24px] border border-dashed border-border-strong bg-surface-subtle p-10 text-center">
          <p className="text-base font-medium text-fg-secondary">
            Enter your current salary and offer base salary to see your offer
            score, negotiation range, and insights.
          </p>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-fg-muted">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-subtle">
        <div
          className="h-2 rounded-full bg-primary-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InsightRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[8px] border border-border-subtle bg-surface-subtle px-5 py-4 text-base leading-relaxed">
      {children}
    </div>
  );
}
