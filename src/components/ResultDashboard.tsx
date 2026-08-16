"use client";

import { useState } from "react";
import { ArrowLeft, Scale, Home, Sparkles } from "lucide-react";
import { CostComparisonRow } from "@/components/CostComparisonRow";
import { CurrencyInput } from "@/components/CurrencyInput";
import { CATEGORY_LABELS } from "@/lib/calculations";
import { formatMoney } from "@/lib/format";
import type { ComparisonResult, CostCategoryKey } from "@/lib/types";

export function ResultDashboard({
  result,
  salary,
  onSalaryChange,
  onBack,
}: {
  result: ComparisonResult;
  salary: number;
  onSalaryChange: (v: number) => void;
  onBack: () => void;
}) {
  const [showCategories, setShowCategories] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[24px] border border-border-subtle bg-surface p-8 shadow-[0px_4px_68px_0px_rgba(0,0,0,0.07)]">
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 -mt-2 flex cursor-pointer items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-subtle active:bg-border-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mt-6">
          <CurrencyInput
            label="Current salary"
            symbol={result.fromCountry.currencySymbol}
            value={salary}
            onChange={onSalaryChange}
            placeholder="100,000"
          />
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-fg-secondary">Target salary</p>
          <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
            <p className="text-3xl font-extrabold leading-[1] tracking-tight text-fg tabular-nums sm:text-[44px]">
              {formatMoney(result.stack.finalMonthly, result.toCountry)}
            </p>
            <p className="pb-1 text-sm font-medium text-fg">/ month</p>
          </div>
        </div>

        <div className="mt-6">
          <BreakdownRow
            icon={Scale}
            label="PPP baseline"
            value={result.stack.pppBaselineMonthly}
            country={result.toCountry}
            rule="dashed"
          />
          <BreakdownRow
            icon={Home}
            label="Housing adjustment"
            value={result.stack.housingAdjustment}
            country={result.toCountry}
            rule="dashed"
            signed
          />
          <BreakdownRow
            icon={Sparkles}
            label="Lifestyle adjustment"
            value={result.stack.lifestyleAdjustment}
            country={result.toCountry}
            rule="solid"
            signed
          />
        </div>

        <div className="mt-6 rounded-[8px] border border-border-subtle bg-surface-subtle p-4">
          <p className="text-sm leading-6 text-body">
            You need{" "}
            <strong className="font-semibold text-fg">
              {formatMoney(result.stack.finalMonthly, result.toCountry)}
            </strong>{" "}
            per month in {result.toCountry.name} to live the same quality of
            life as{" "}
            <strong className="font-semibold text-fg">
              {formatMoney(result.currentSalaryMonthly, result.fromCountry)}
            </strong>{" "}
            per month in {result.fromCountry.name}.
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-border-subtle bg-surface p-8 shadow-[0px_4px_68px_0px_rgba(0,0,0,0.07)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-fg">Where your money may go</h2>
          <button
            type="button"
            onClick={() => setShowCategories((s) => !s)}
            className="text-sm font-medium text-primary-600"
          >
            {showCategories ? "Hide" : "Show"}
          </button>
        </div>
        {showCategories && (
          <>
            <div className="mt-5 divide-y divide-border">
              {(Object.keys(CATEGORY_LABELS) as CostCategoryKey[]).map((key) => (
                <CostComparisonRow
                  key={key}
                  categoryKey={key}
                  label={CATEGORY_LABELS[key]}
                  fromLabel={result.fromCountry.name}
                  toLabel={result.toCountry.name}
                  from={result.categoryComparison[key].from}
                  to={result.categoryComparison[key].to}
                  pctDiff={result.categoryComparison[key].pctDiff}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-fg-faint">
              Country-level approximation, not city-specific.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function BreakdownRow({
  icon: Icon,
  label,
  value,
  country,
  rule,
  signed,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  country: ComparisonResult["toCountry"];
  rule: "dashed" | "solid";
  signed?: boolean;
}) {
  const sign = signed && value > 0 ? "+ " : signed && value < 0 ? "− " : "";
  return (
    <div
      className={
        rule === "dashed"
          ? "flex h-12 items-center justify-between border-b border-dashed border-border"
          : "flex h-12 items-center justify-between border-b border-border"
      }
    >
      <span className="flex items-center gap-2 text-base font-medium text-fg-secondary">
        <Icon size={20} />
        {label}
      </span>
      <span className="text-base font-semibold text-fg tabular-nums">
        {sign}
        {formatMoney(Math.abs(value), country)}
      </span>
    </div>
  );
}
