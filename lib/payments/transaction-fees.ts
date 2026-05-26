import { roundMoney } from "@/lib/prices";

export interface TransactionFeeRule {
  variableRate: number;
  fixedAmount: number;
}

export const DEFAULT_STRIPE_CARD_FEE_PT_EEA: TransactionFeeRule = {
  variableRate: 0.015,
  fixedAmount: 0.25,
};

export function calculateTransactionFee(
  totalPaid: number,
  rule: TransactionFeeRule = DEFAULT_STRIPE_CARD_FEE_PT_EEA,
): number {
  if (!Number.isFinite(totalPaid) || totalPaid <= 0) return 0;
  return roundMoney(totalPaid * rule.variableRate + rule.fixedAmount);
}
