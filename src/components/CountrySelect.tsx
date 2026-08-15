"use client";

import { useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountryFlag } from "@/components/CountryFlag";
import { countries } from "@/lib/data/countries";
import type { Country } from "@/lib/types";

export function CountrySelect({
  label,
  hint,
  value,
  onChange,
  excludeCode,
}: {
  label: string;
  hint?: string;
  value: Country;
  onChange: (country: Country) => void;
  excludeCode?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = countries.filter((c) => c.code !== excludeCode);
    if (!q) return pool;
    return pool.filter((c) => c.name.toLowerCase().includes(q));
  }, [query, excludeCode]);

  function select(country: Country) {
    onChange(country);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const country = results[highlighted];
      if (country) select(country);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <span
        id={labelId}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-secondary"
      >
        {label}
        {hint && (
          <span title={hint}>
            <Info size={14} className="text-fg-muted" aria-hidden />
          </span>
        )}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => {
          setOpen(true);
          setHighlighted(0);
        }}
        className="flex w-full items-center gap-2 rounded-[8px] border border-border bg-surface px-4 h-12 text-left transition-colors hover:border-primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      >
        <CountryFlag
          code={value.code}
          emoji={value.flag}
          className="h-4 w-6 shrink-0"
        />
        <span className="flex-1 truncate text-base font-medium text-fg">
          {value.name}
        </span>
        <ChevronDown size={20} className="shrink-0 text-fg-muted" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute z-20 mt-2 w-full min-w-64 rounded-[12px] border border-border bg-surface shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search size={16} className="text-fg-muted shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlighted(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search country..."
                className="w-full bg-transparent text-base outline-none placeholder:text-fg-muted"
              />
            </div>
            <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
              {results.length === 0 && (
                <li className="px-4 py-3 text-sm text-fg-muted">
                  No matching countries yet.
                </li>
              )}
              {results.map((country, i) => (
                <li key={country.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === highlighted}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => select(country)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                      i === highlighted ? "bg-primary-50" : ""
                    )}
                  >
                    <CountryFlag
                      code={country.code}
                      emoji={country.flag}
                      className="h-4 w-6 shrink-0"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-base font-medium truncate">
                        {country.name}
                      </span>
                    </span>
                    <span className="text-xs text-fg-muted">
                      {country.currencyCode}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
