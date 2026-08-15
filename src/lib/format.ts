import type { Country } from "@/lib/types";

const LOCALE_BY_CURRENCY: Record<string, string> = {
  INR: "en-IN",
};

function localeFor(country: Country) {
  return LOCALE_BY_CURRENCY[country.currencyCode] ?? "en-US";
}

export function formatMoney(amount: number, country: Country) {
  const formatted = new Intl.NumberFormat(localeFor(country), {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${country.currencySymbol} ${formatted}`;
}

export function formatCompact(amount: number, country: Country) {
  const formatted = new Intl.NumberFormat(localeFor(country), {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
  return `${country.currencySymbol} ${formatted}`;
}

export function formatPercent(pct: number, opts?: { showSign?: boolean }) {
  const sign = opts?.showSign && pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(0)}%`;
}
