"use client";

import { useId } from "react";
import { Info } from "lucide-react";

export function CurrencyInput({
  label,
  hint,
  symbol,
  value,
  onChange,
  locale = "en-US",
  placeholder = "0",
}: {
  label: string;
  hint?: string;
  symbol: string;
  value: number;
  onChange: (value: number) => void;
  locale?: string;
  placeholder?: string;
}) {
  const inputId = useId();
  const display =
    value === 0
      ? ""
      : new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
          value
        );

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-secondary"
      >
        {label}
        {hint && (
          <span title={hint}>
            <Info size={14} className="text-fg-muted" aria-hidden />
          </span>
        )}
      </label>
      <div className="flex items-center gap-2 rounded-[8px] border border-border bg-surface px-4 h-12 transition-colors focus-within:border-primary-400">
        <span className="text-fg font-medium text-base shrink-0">
          {symbol}
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={display}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, "");
            onChange(digits === "" ? 0 : parseInt(digits, 10));
          }}
          className="w-full bg-transparent text-base font-medium text-fg tabular-nums outline-none placeholder:font-normal placeholder:text-fg-muted"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
