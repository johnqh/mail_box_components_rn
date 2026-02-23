import { type ClassValue, clsx } from 'clsx';

/**
 * Merges class names for React Native with NativeWind.
 *
 * Unlike the web version (`@sudobility/components`), this does NOT use
 * `tailwind-merge` since NativeWind processes Tailwind classes at build
 * time and handles conflict resolution internally.
 *
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns A single merged class name string
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
