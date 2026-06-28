import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names, resolving Tailwind conflicts so the LAST class wins —
 * matching the web design system (`@sudobility/components`). NativeWind does NOT
 * resolve same-property conflicts on its own (e.g. `w-full` + `w-20`, or
 * `bg-white` + `bg-card`), so a passed `className` override would otherwise lose.
 * Using `tailwind-merge` here keeps web and RN consistent.
 *
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns A single merged class name string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
