import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Currency formatting utility
export function formatCurrency(amount, showSymbol = true) {
  const formattedAmount = parseFloat(amount).toFixed(2);
  return showSymbol ? `₹${formattedAmount}` : formattedAmount;
}
