export default interface PricingPlanOptions {
  description: string;
  price: number;
  months: number;
  benefits: Array<{ name: string; include: boolean }>;
}
