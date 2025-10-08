export const formatCurrency = (
  amount: number,
  currency: string = "SAR"
): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency,
  }).format(amount);
};