"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalculatorCard } from "@/components/CalculatorCard";
import { ResultDashboard } from "@/components/ResultDashboard";
import { getCountry } from "@/lib/data/countries";
import { computeComparison } from "@/lib/calculations";
import type { Country } from "@/lib/types";

export function SalaryCompareApp({
  initialFromCode,
  initialToCode,
}: {
  initialFromCode?: string;
  initialToCode?: string;
} = {}) {
  const [fromCountry, setFromCountry] = useState<Country>(
    getCountry(initialFromCode ?? "IN")
  );
  const [toCountry, setToCountry] = useState<Country>(
    getCountry(initialToCode ?? "AE")
  );
  const [salary, setSalary] = useState(0);
  const [view, setView] = useState<"calculator" | "results">("calculator");

  const result = useMemo(
    () =>
      computeComparison({
        fromCountry,
        toCountry,
        currentSalaryMonthly: salary,
      }),
    [fromCountry, toCountry, salary]
  );

  if (view === "results") {
    return (
      <div className="relative">
        <div className="bg-primary-600 px-6 pb-56 pt-16 sm:pb-[220px] sm:pt-11">
          <div className="mx-auto max-w-[600px] text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[40px] sm:leading-[48px]">
              Compare your salary abroad
            </h1>
          </div>
        </div>
        <div className="relative z-10 mx-auto -mt-48 max-w-[560px] px-6 sm:-mt-44">
          <ResultDashboard
            result={result}
            salary={salary}
            onSalaryChange={setSalary}
            onBack={() => setView("calculator")}
          />
        </div>
        <DataSourceFooter />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-primary-600 px-6 pb-48 pt-10 sm:pb-40 sm:pt-8">
        <div className="mx-auto max-w-[480px] text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[40px] sm:leading-[48px] sm:tracking-[-1px]">
            Compare your
            <br />
            salary abroad
          </h1>
          <p className="mt-3 text-base leading-6 text-primary-200">
            See the equivalent salary you need in another country to live a
            similar quality of life.
          </p>
        </div>
      </div>
      <div className="relative z-10 mx-auto -mt-40 max-w-[488px] px-6 sm:-mt-32">
        <CalculatorCard
          fromCountry={fromCountry}
          toCountry={toCountry}
          onFromChange={setFromCountry}
          onToChange={setToCountry}
          salary={salary}
          onSalaryChange={setSalary}
          onSubmit={() => setView("results")}
        />
      </div>
      <DataSourceFooter />
    </div>
  );
}

function DataSourceFooter() {
  return (
    <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 px-6 pb-8 pt-10 text-center text-xs text-fg-muted">
      <span>Illustrative reference data</span>
      <span aria-hidden className="text-border-strong">
        •
      </span>
      <span>Updated 2026</span>
      <span aria-hidden className="text-border-strong">
        •
      </span>
      <Link href="/methodology" className="font-medium text-primary-600 underline">
        Learn more
      </Link>
    </div>
  );
}
