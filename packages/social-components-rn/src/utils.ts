import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for conditional class name merging
 * Uses clsx for React Native (no tailwind-merge needed)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
