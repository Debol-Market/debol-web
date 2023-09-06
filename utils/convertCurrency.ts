export default function convertCurrency(
  amount: number,
  multiplier: number,
  currency: string,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Math.round(amount * multiplier) / 100);
}
