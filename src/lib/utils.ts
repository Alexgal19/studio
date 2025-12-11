import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function forceRevalidate() {
  // This function is intentionally left blank.
  // Its presence is to force Next.js to re-evaluate its cache.
}
