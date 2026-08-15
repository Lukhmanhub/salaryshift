import type {
  ComparisonResult,
  Country,
  CostCategoryKey,
  LifestyleLevel,
  PersonalizationInputs,
  TaxModel,
} from "@/lib/types";

const DEFAULT_PERSONALIZATION: PersonalizationInputs = {
  lifestyle: "standard",
  includeTax: false,
};

// Applied to the discretionary (non-housing) share of the estimate.
const LIFESTYLE_MULTIPLIER: Record<LifestyleLevel, number> = {
  essential: 0.85,
  standard: 1.0,
  comfortable: 1.15,
  premium: 1.35,
};

// Applied to the housing share of the estimate — housing swings more than
// general discretionary spending as a lifestyle tier changes.
const LIFESTYLE_HOUSING_MULTIPLIER: Record<LifestyleLevel, number> = {
  essential: 0.8,
  standard: 1.0,
  comfortable: 1.25,
  premium: 1.6,
};

export const CATEGORY_LABELS: Record<CostCategoryKey, string> = {
  housing: "Housing",
  groceries: "Groceries",
  dining: "Dining",
  transport: "Transportation",
  utilities: "Utilities",
  healthcare: "Healthcare",
  education: "Education",
  entertainment: "Entertainment",
  personalCare: "Personal care",
  other: "Other essentials",
};

const NON_HOUSING_CATEGORY_WEIGHTS: Record<
  Exclude<CostCategoryKey, "housing">,
  number
> = {
  groceries: 0.9,
  dining: 1.05,
  transport: 0.8,
  utilities: 0.85,
  healthcare: 0.75,
  education: 0.7,
  entertainment: 1.0,
  personalCare: 0.95,
  other: 0.9,
};

const HOUSING_BASKET_SHARE = 0.3;
const DISCRETIONARY_SHARE = 0.4;

export function roundSensible(n: number): number {
  const abs = Math.abs(n);
  let step: number;
  if (abs >= 100000) step = 1000;
  else if (abs >= 10000) step = 100;
  else if (abs >= 1000) step = 50;
  else if (abs >= 100) step = 10;
  else step = 1;
  return Math.round(n / step) * step;
}

export function toMonthly(amount: number, frequency: "monthly" | "annual") {
  return frequency === "annual" ? amount / 12 : amount;
}

export function fxConvert(
  amountLocal: number,
  fromFxToUsd: number,
  toFxToUsd: number
) {
  const usd = amountLocal / fromFxToUsd;
  return usd * toFxToUsd;
}

function computeTax(annualIncome: number, model: TaxModel) {
  if (model.type === "flat") {
    return annualIncome * model.rate;
  }
  let tax = 0;
  let lower = 0;
  for (const bracket of model.brackets) {
    const upper = bracket.upTo ?? Infinity;
    if (annualIncome <= lower) break;
    const taxableInBand = Math.min(annualIncome, upper) - lower;
    if (taxableInBand > 0) tax += taxableInBand * bracket.rate;
    lower = upper;
  }
  return tax;
}

export type CompareInputs = {
  fromCountry: Country;
  toCountry: Country;
  currentSalaryMonthly: number;
  personalization?: Partial<PersonalizationInputs>;
};

export function computeComparison({
  fromCountry,
  toCountry,
  currentSalaryMonthly,
  personalization,
}: CompareInputs): ComparisonResult {
  const p: PersonalizationInputs = {
    ...DEFAULT_PERSONALIZATION,
    ...personalization,
  };

  const intlDollars = currentSalaryMonthly / fromCountry.pppFactor;
  const pppBaselineMonthly = intlDollars * toCountry.pppFactor;

  const housingAdjustment =
    pppBaselineMonthly *
    HOUSING_BASKET_SHARE *
    (LIFESTYLE_HOUSING_MULTIPLIER[p.lifestyle] - 1);

  const lifestyleAdjustment =
    pppBaselineMonthly *
    DISCRETIONARY_SHARE *
    (LIFESTYLE_MULTIPLIER[p.lifestyle] - 1);

  const finalMonthly = pppBaselineMonthly + housingAdjustment + lifestyleAdjustment;

  const fxEquivalentMonthly = fxConvert(
    currentSalaryMonthly,
    fromCountry.fxToUsd,
    toCountry.fxToUsd
  );

  const touchedPersonalization = Boolean(
    personalization &&
      Object.keys(personalization).some(
        (key) =>
          personalization[key as keyof PersonalizationInputs] !==
          DEFAULT_PERSONALIZATION[key as keyof PersonalizationInputs]
      )
  );

  const categoryComparison = buildCategoryComparison(fromCountry, toCountry);

  let takeHome: ReturnType<typeof buildTakeHome> | null = null;
  if (p.includeTax) {
    takeHome = buildTakeHome(finalMonthly, toCountry);
  }

  return {
    fromCountry,
    toCountry,
    currentSalaryMonthly,
    fxEquivalentMonthly: roundSensible(fxEquivalentMonthly),
    stack: {
      pppBaselineMonthly: roundSensible(pppBaselineMonthly),
      housingAdjustment: roundSensible(housingAdjustment),
      lifestyleAdjustment: roundSensible(lifestyleAdjustment),
      finalMonthly: roundSensible(finalMonthly),
    },
    range: {
      minimum: roundSensible(pppBaselineMonthly * 0.99),
      equivalent: roundSensible(finalMonthly),
      comfortable: roundSensible(finalMonthly * 1.14),
    },
    confidence: touchedPersonalization ? "High" : ("Medium" as const),
    categoryComparison,
    takeHome,
  };
}

function buildTakeHome(finalMonthly: number, toCountry: Country) {
  const grossAnnual = roundSensible(finalMonthly * 12);
  const taxAmount = computeTax(grossAnnual, toCountry.tax);
  const netAnnual = grossAnnual - taxAmount;
  return {
    grossAnnual,
    estimatedTaxRate: taxAmount / grossAnnual,
    netAnnual: roundSensible(netAnnual),
    netMonthly: roundSensible(netAnnual / 12),
  };
}

// Deterministic per-country, per-category variance so cost categories don't
// all move by the exact same percentage (which the shared livingIndex would
// otherwise produce, since a uniform weight cancels out of the ratio).
function categoryVariance(countryCode: string, category: string): number {
  let hash = 0;
  for (const ch of `${countryCode}:${category}`) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  const frac = (hash % 1000) / 1000;
  return 0.85 + frac * 0.3;
}

function buildCategoryComparison(fromCountry: Country, toCountry: Country) {
  const build = (country: Country) => {
    const result: Record<CostCategoryKey, number> = {
      housing: country.housingIndex,
    } as Record<CostCategoryKey, number>;
    for (const key of Object.keys(NON_HOUSING_CATEGORY_WEIGHTS) as Array<
      keyof typeof NON_HOUSING_CATEGORY_WEIGHTS
    >) {
      result[key] =
        country.livingIndex *
        NON_HOUSING_CATEGORY_WEIGHTS[key] *
        categoryVariance(country.code, key);
    }
    return result;
  };
  const from = build(fromCountry);
  const to = build(toCountry);
  const out = {} as Record<
    CostCategoryKey,
    { from: number; to: number; pctDiff: number }
  >;
  (Object.keys(CATEGORY_LABELS) as CostCategoryKey[]).forEach((key) => {
    out[key] = {
      from: from[key],
      to: to[key],
      pctDiff: ((to[key] - from[key]) / from[key]) * 100,
    };
  });
  return out;
}

export function estimateOfferScore(input: {
  currentTotalCompMonthly: number;
  offerTotalCompMonthly: number;
  targetEquivalentMonthly: number;
  targetComfortableMonthly: number;
  housingAffordabilityRatio: number; // offer housing allowance / expected rent, 1 = fully covered
}) {
  const purchasingPower = clampScore(
    50 +
      ((input.offerTotalCompMonthly - input.targetEquivalentMonthly) /
        input.targetEquivalentMonthly) *
        150
  );
  const takeHome = clampScore(
    50 +
      ((input.offerTotalCompMonthly - input.currentTotalCompMonthly) /
        input.currentTotalCompMonthly) *
        100
  );
  const housing = clampScore(input.housingAffordabilityRatio * 100);
  const savings = clampScore(
    50 +
      ((input.offerTotalCompMonthly - input.targetComfortableMonthly) /
        input.targetComfortableMonthly) *
        150
  );
  const benefits = clampScore(60);
  const overall = Math.round(
    purchasingPower * 0.3 +
      takeHome * 0.25 +
      housing * 0.2 +
      savings * 0.15 +
      benefits * 0.1
  );
  return {
    overall,
    components: { purchasingPower, takeHome, housing, savings, benefits },
  };
}

function clampScore(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}
