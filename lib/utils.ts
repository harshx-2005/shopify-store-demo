import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: string | number,
  currencyCode: string = "INR"
): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (isNaN(value)) return "";

  // Always format as Indian Rupees (INR) for the Indian luxury design demo
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
