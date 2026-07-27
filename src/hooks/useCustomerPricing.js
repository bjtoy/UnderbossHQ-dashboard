import { useMemo } from "react";
import {
  detectCustomerCurrency,
  formatAudPrice,
  formatMonthlyPlan,
  formatAnnualPlan,
  formatMinorUnits,
  describeCheckoutAmount,
  getPricingPageSubtitle,
  getCustomerCurrencyLabel,
  BASE_CURRENCY,
} from "../utils/customerCurrency.js";

export function useCustomerPricing(billingCheckout = null) {
  return useMemo(() => {
    const currency = detectCustomerCurrency();
    const usesLocalCurrency = currency !== BASE_CURRENCY;

    return {
      currency,
      usesLocalCurrency,
      baseCurrency: BASE_CURRENCY,
      formatPrice: (amountAud, options = {}) =>
        formatAudPrice(amountAud, { currency, ...options }),
      formatMonthly: (plan, options = {}) =>
        formatMonthlyPlan(plan, { currency, ...options }),
      formatAnnual: (plan, options = {}) =>
        formatAnnualPlan(plan, { currency, ...options }),
      formatCheckoutMinor: (amountMinor, checkoutCurrency, options = {}) =>
        formatMinorUnits(amountMinor, checkoutCurrency, { currency, ...options }),
      checkoutDescription: billingCheckout
        ? describeCheckoutAmount(billingCheckout, { currency })
        : null,
      pricingSubtitle: getPricingPageSubtitle(),
      currencyLabel: getCustomerCurrencyLabel(),
    };
  }, [billingCheckout?.amountMinor, billingCheckout?.currency, billingCheckout?.periodDays]);
}
