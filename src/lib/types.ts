export type TaxBracket = { upTo: number | null; rate: number };

export type TaxModel =
  | { type: "flat"; rate: number }
  | { type: "brackets"; brackets: TaxBracket[] };

export type Country = {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  flag: string;
  /** Local currency units per 1 US dollar (illustrative reference rate). */
  fxToUsd: number;
  /** Local currency units per 1 international (PPP) dollar. */
  pppFactor: number;
  /** Country-level average housing cost index, NYC = 100 (approximate, for the cost breakdown only). */
  housingIndex: number;
  /** Country-level average non-housing living cost index, NYC = 100 (approximate, for the cost breakdown only). */
  livingIndex: number;
  tax: TaxModel;
  dataYear: number;
};

export type LifestyleLevel = "essential" | "standard" | "comfortable" | "premium";

export type SalaryFrequency = "monthly" | "annual";

export type CostCategoryKey =
  | "housing"
  | "groceries"
  | "dining"
  | "transport"
  | "utilities"
  | "healthcare"
  | "education"
  | "entertainment"
  | "personalCare"
  | "other";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type PersonalizationInputs = {
  lifestyle: LifestyleLevel;
  includeTax: boolean;
};

export type CalculationStack = {
  pppBaselineMonthly: number;
  housingAdjustment: number;
  lifestyleAdjustment: number;
  finalMonthly: number;
};

export type SalaryRangeBand = {
  minimum: number;
  equivalent: number;
  comfortable: number;
};

export type ComparisonResult = {
  fromCountry: Country;
  toCountry: Country;
  currentSalaryMonthly: number;
  fxEquivalentMonthly: number;
  stack: CalculationStack;
  range: SalaryRangeBand;
  confidence: ConfidenceLevel;
  categoryComparison: Record<
    CostCategoryKey,
    { from: number; to: number; pctDiff: number }
  >;
  takeHome: {
    grossAnnual: number;
    estimatedTaxRate: number;
    netAnnual: number;
    netMonthly: number;
  } | null;
};
