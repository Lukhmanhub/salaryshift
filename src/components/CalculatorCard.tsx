"use client";

import { ArrowRight } from "lucide-react";
import { CountrySelect } from "@/components/CountrySelect";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Button } from "@/components/ui/Button";
import type { Country } from "@/lib/types";

export function CalculatorCard({
  fromCountry,
  toCountry,
  onFromChange,
  onToChange,
  salary,
  onSalaryChange,
  onSubmit,
}: {
  fromCountry: Country;
  toCountry: Country;
  onFromChange: (country: Country) => void;
  onToChange: (country: Country) => void;
  salary: number;
  onSalaryChange: (v: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-[0px_24px_48px_-12px_rgba(13,23,51,0.08),0px_8px_24px_-4px_rgba(13,23,51,0.06)]">
      <div className="flex flex-col gap-4">
        <CountrySelect
          label="Current location"
          value={fromCountry}
          onChange={onFromChange}
          excludeCode={toCountry.code}
        />
        <CurrencyInput
          label="Current salary"
          symbol={fromCountry.currencySymbol}
          value={salary}
          onChange={onSalaryChange}
          placeholder="100,000"
        />
        <CountrySelect
          label="Destination"
          value={toCountry}
          onChange={onToChange}
          excludeCode={fromCountry.code}
        />

        <div className="flex flex-col items-center gap-3 pt-1">
          <Button
            size="lg"
            className="w-full"
            onClick={onSubmit}
            disabled={salary <= 0}
          >
            Compare salary
            <ArrowRight size={20} />
          </Button>
          <p className="flex flex-wrap items-center justify-center gap-2 text-center text-xs text-fg-muted">
            100% private
            <span aria-hidden className="text-border-strong">
              •
            </span>
            No sign-up required
            <span aria-hidden className="text-border-strong">
              •
            </span>
            Instant results
          </p>
        </div>
      </div>
    </div>
  );
}
