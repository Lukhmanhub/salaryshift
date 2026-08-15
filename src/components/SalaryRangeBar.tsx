"use client";

import { formatCompact } from "@/lib/format";
import type { Country, SalaryRangeBand } from "@/lib/types";

export function SalaryRangeBar({
  range,
  country,
  marker,
}: {
  range: SalaryRangeBand;
  country: Country;
  marker?: { label: string; value: number };
}) {
  const points = [
    { key: "minimum", label: "Minimum", value: range.minimum },
    { key: "equivalent", label: "Equivalent", value: range.equivalent },
    { key: "comfortable", label: "Comfortable", value: range.comfortable },
  ] as const;

  const max = Math.max(range.comfortable, marker?.value ?? 0) * 1.08;
  const min = range.minimum * 0.9;
  const span = max - min;
  const pct = (v: number) => ((v - min) / span) * 100;
  const equivalentPct = pct(range.equivalent);

  return (
    <div className="pt-2 pb-6">
      <div className="relative h-2 rounded-full bg-primary-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary-600"
          style={{
            left: `${equivalentPct}%`,
            width: `${100 - equivalentPct}%`,
          }}
        />
        {points.map((p) => (
          <div
            key={p.key}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${pct(p.value)}%` }}
          >
            <div
              className={
                p.key === "equivalent"
                  ? "h-4 w-4 rounded-full bg-primary-600 ring-4 ring-primary-200"
                  : "h-3 w-3 rounded-full bg-primary-500"
              }
            />
          </div>
        ))}
        {marker && (
          <div
            className="absolute -top-7 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${pct(marker.value)}%` }}
          >
            <span className="whitespace-nowrap rounded-full bg-fg px-2 py-1 text-xs font-medium text-bg">
              {marker.label}
            </span>
            <span className="h-2 w-px bg-fg" />
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {points.map((p) => (
          <div key={p.key}>
            <p
              className={
                p.key === "equivalent"
                  ? "text-xs font-medium text-primary-600"
                  : "text-xs text-fg-muted"
              }
            >
              {p.label}
            </p>
            <p className="text-base font-semibold tabular-nums">
              {formatCompact(p.value, country)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
