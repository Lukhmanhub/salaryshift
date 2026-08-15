import {
  Home,
  ShoppingBasket,
  Utensils,
  Car,
  Zap,
  HeartPulse,
  GraduationCap,
  Popcorn,
  Sparkles,
  Package,
} from "lucide-react";
import { formatPercent } from "@/lib/format";
import type { CostCategoryKey } from "@/lib/types";

const ICONS: Record<CostCategoryKey, React.ComponentType<{ size?: number }>> = {
  housing: Home,
  groceries: ShoppingBasket,
  dining: Utensils,
  transport: Car,
  utilities: Zap,
  healthcare: HeartPulse,
  education: GraduationCap,
  entertainment: Popcorn,
  personalCare: Sparkles,
  other: Package,
};

export function CostComparisonRow({
  categoryKey,
  label,
  fromLabel,
  toLabel,
  from,
  to,
  pctDiff,
}: {
  categoryKey: CostCategoryKey;
  label: string;
  fromLabel: string;
  toLabel: string;
  from: number;
  to: number;
  pctDiff: number;
}) {
  const Icon = ICONS[categoryKey];
  const max = Math.max(from, to, 1);

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-semibold text-fg">
          <Icon size={20} />
          {label}
        </div>
        <span
          className={
            pctDiff >= 0
              ? "text-base font-semibold text-critical"
              : "text-base font-semibold text-success"
          }
        >
          {formatPercent(pctDiff, { showSign: true })}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <span className="w-[120px] shrink-0 text-xs text-fg-muted">
            {fromLabel}
          </span>
          <div className="h-2 flex-1 rounded-full bg-track">
            <div
              className="h-2 rounded-full bg-primary-300"
              style={{ width: `${(from / max) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-[120px] shrink-0 text-xs text-fg-muted">
            {toLabel}
          </span>
          <div className="h-2 flex-1 rounded-full bg-track">
            <div
              className="h-2 rounded-full bg-primary-600"
              style={{ width: `${(to / max) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
