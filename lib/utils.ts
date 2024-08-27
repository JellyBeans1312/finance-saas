import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function convertAmountToMiliunites(amount: number) {
  return Math.round(amount * 1000);
};

export function convertAmountFromMiliunites(amount: number) {
  return Math.round(amount / 1000)
};
