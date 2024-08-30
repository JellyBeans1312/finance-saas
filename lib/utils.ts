import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
};

export function convertAmountFromMiliunits(amount: number) {
  return Math.round(amount / 1000)
};

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "usd",
    minimumFractionDigits: 2,
  }).format(value)
}
