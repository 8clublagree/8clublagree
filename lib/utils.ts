import { clsx, type ClassValue } from "clsx";
import { Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  value: number | string,
  options: {
    decimals?: number;
    locale?: string;
  } = {}
): string {
  const { decimals = 0, locale = "en-US" } = options;

  // Convert to number safely
  const num = Number(value);
  if (isNaN(num)) return "0";

  // Use Intl.NumberFormat for consistent locale-based formatting
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export const formatTime = (dateTime: Dayjs) => {
  return dateTime.format("hh:mm A");
};

export const calculateDuration = (start: Dayjs, end: Dayjs): string => {
  if (end.isBefore(start)) {
    end = end.add(1, "day");
  }

  const diffInMinutes = end.diff(start, "minute");
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

export const getSlotsLeft = (
  availableSlots: number,
  takenSlots: number
): number => {
  const slotsLeft = availableSlots - takenSlots;
  return slotsLeft > 0 ? slotsLeft : 0;
};
