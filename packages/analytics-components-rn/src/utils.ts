import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for merging class names
 * Using clsx for React Native (no tailwind-merge needed)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
