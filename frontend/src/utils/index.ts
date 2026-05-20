import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    New: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Qualified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
}

export function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    Website: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Instagram: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    Referral: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  };
  return colors[source] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
}

export function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number
): (...args: string[]) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: string[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
