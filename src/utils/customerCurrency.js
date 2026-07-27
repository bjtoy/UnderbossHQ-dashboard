/** Base merchant currency — all catalog prices are stored in major AUD units. */
export const BASE_CURRENCY = "AUD";

/** Approximate FX from 1 AUD (display only; checkout settles in merchant currency). */
const RATES_FROM_AUD = {
  AUD: 1,
  USD: 0.64,
  GBP: 0.51,
  EUR: 0.59,
  NZD: 1.07,
  CAD: 0.87,
  SGD: 0.86,
  JPY: 97,
  HKD: 5.0,
  INR: 53,
};

const REGION_CURRENCY = {
  AU: "AUD",
  US: "USD",
  GB: "GBP",
  NZ: "NZD",
  CA: "CAD",
  SG: "SGD",
  JP: "JPY",
  HK: "HKD",
  IN: "INR",
  IE: "EUR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  AT: "EUR",
  BE: "EUR",
  PT: "EUR",
  FI: "EUR",
};

function regionFromLocale(locale) {
  const parts = String(locale || "").split("-");
  return parts.length >= 2 ? parts[1].toUpperCase() : null;
}

function currencyFromTimezone(timeZone) {
  const tz = String(timeZone || "");
  if (tz.includes("Australia")) return "AUD";
  if (tz.startsWith("Pacific/Auckland")) return "NZD";
  if (tz.startsWith("Europe/London")) return "GBP";
  if (tz.startsWith("America/")) return "USD";
  if (tz.startsWith("Asia/Singapore")) return "SGD";
  if (tz.startsWith("Asia/Tokyo")) return "JPY";
  if (tz.startsWith("Asia/Hong_Kong")) return "HKD";
  if (tz.startsWith("Asia/Kolkata")) return "INR";
  if (tz.startsWith("Europe/")) return "EUR";
  return null;
}

export function detectCustomerCurrency() {
  if (typeof navigator === "undefined") {
    return BASE_CURRENCY;
  }

  const locale = navigator.language || "en-AU";
  const region = regionFromLocale(locale);
  if (region && REGION_CURRENCY[region]) {
    return REGION_CURRENCY[region];
  }

  try {
    const tzCurrency = currencyFromTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    if (tzCurrency) {
      return tzCurrency;
    }
  } catch {
    /* ignore */
  }

  return BASE_CURRENCY;
}

export function convertAudMajor(amountAud, targetCurrency = detectCustomerCurrency()) {
  const rate = RATES_FROM_AUD[targetCurrency] ?? RATES_FROM_AUD.USD;
  const converted = Number(amountAud) * rate;

  if (targetCurrency === "JPY") {
    return Math.round(converted);
  }

  return Math.round(converted * 100) / 100;
}

export function formatMoney(
  amountMajor,
  currency,
  locale = typeof navigator !== "undefined" ? navigator.language : "en-AU"
) {
  const fractionDigits = currency === "JPY" ? 0 : 2;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amountMajor);
  } catch {
    return `${amountMajor} ${currency}`;
  }
}

export function formatAudPrice(amountAud, options = {}) {
  const customerCurrency = options.currency || detectCustomerCurrency();
  const locale = options.locale || (typeof navigator !== "undefined" ? navigator.language : "en-AU");

  if (customerCurrency === BASE_CURRENCY) {
    return formatMoney(amountAud, BASE_CURRENCY, locale);
  }

  const converted = convertAudMajor(amountAud, customerCurrency);
  const localized = formatMoney(converted, customerCurrency, locale);

  if (options.showBase) {
    const base = formatMoney(amountAud, BASE_CURRENCY, "en-AU");
    return `${localized} (≈ ${base})`;
  }

  return localized;
}

export function formatMonthlyPlan(plan, options = {}) {
  return `${formatAudPrice(plan.priceMonthly, options)}/mo`;
}

export function formatAnnualPlan(plan, options = {}) {
  return `${formatAudPrice(plan.priceAnnual, options)}/yr`;
}

export function formatMinorUnits(amountMinor, currency, options = {}) {
  const major = Number(amountMinor) / 100;
  const customerCurrency = options.currency || detectCustomerCurrency();
  const locale = options.locale || (typeof navigator !== "undefined" ? navigator.language : "en-AU");

  if (currency === customerCurrency) {
    return formatMoney(major, currency, locale);
  }

  if (currency === BASE_CURRENCY && customerCurrency !== BASE_CURRENCY) {
    const converted = convertAudMajor(major, customerCurrency);
    return formatMoney(converted, customerCurrency, locale);
  }

  return formatMoney(major, currency, locale);
}

export function getPricingPageSubtitle() {
  const customerCurrency = detectCustomerCurrency();

  if (customerCurrency === BASE_CURRENCY) {
    return "All prices in AUD. Free accounts include real community tools. Premium unlocks creation, moderation, and Discord publishing.";
  }

  return `Prices shown in ${customerCurrency} (approximate). Checkout is charged in AUD. Free accounts include real community tools. Premium unlocks creation, moderation, and Discord publishing.`;
}

export function describeCheckoutAmount(billingCheckout, options = {}) {
  if (!billingCheckout?.currency) {
    return null;
  }

  const customerCurrency = options.currency || detectCustomerCurrency();
  const planId = options.planId || billingCheckout.defaultPlanId;
  const planFromList = billingCheckout.plans?.find((plan) => plan.id === planId);
  const amountMinor =
    planFromList?.amountMinor ?? billingCheckout.amountMinor;
  const periodDays =
    planFromList?.periodDays ?? billingCheckout.periodDays;
  const currency = planFromList?.currency ?? billingCheckout.currency;

  if (!amountMinor) {
    return null;
  }

  const localized = formatMinorUnits(amountMinor, currency, { currency: customerCurrency });
  const periodLabel = periodDays ? `${periodDays} days` : "billing period";

  if (currency === customerCurrency) {
    return `${localized} for ${periodLabel}`;
  }

  const merchantAmount = formatMoney(amountMinor / 100, currency, "en-AU");
  return `${localized} (charged ${merchantAmount}) for ${periodLabel}`;
}

export function getCustomerCurrencyLabel() {
  return detectCustomerCurrency();
}
