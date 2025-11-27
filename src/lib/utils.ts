import { type ClassValue, clsx } from 'clsx';

/**
 * Merges class names for React Native with NativeWind.
 * Unlike web version, we don't need tailwind-merge since NativeWind
 * processes Tailwind classes at build time.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
