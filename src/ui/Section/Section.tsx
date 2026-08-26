import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import { Container } from '../Container';

export type SectionVariant =
  | 'default'
  | 'hero'
  | 'feature'
  | 'cta'
  | 'testimonial'
  | 'footer';

export type SectionSpacing =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type SectionBackground = 'none' | 'default' | 'surface';

export interface SectionProps {
  children: React.ReactNode;
  variant?: SectionVariant;
  spacing?: SectionSpacing;
  background?: SectionBackground;
  /** Max width of the inner container. */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  /** Classes applied to the inner container. */
  containerClassName?: string;
  /** Render children directly, without the inner container. */
  fullWidth?: boolean;
}

const variantClasses: Record<SectionVariant, string> = {
  default: '',
  hero: 'overflow-hidden',
  feature: 'bg-card',
  cta: 'overflow-hidden',
  testimonial: 'bg-muted',
  footer: 'bg-card border-border border-t',
};

const spacingClasses: Record<SectionSpacing, string> = {
  none: '',
  xs: 'py-2',
  sm: 'py-3',
  md: 'py-4',
  lg: 'py-6',
  xl: 'py-8',
  '2xl': 'py-12',
  '3xl': 'py-16',
  '4xl': 'py-20',
  '5xl': 'py-24',
};

/**
 * The `background` variants are the flat ones only.
 *
 * The web component also offers five gradients. React Native has no CSS
 * gradient, so honouring those would mean a `react-native-linear-gradient`
 * dependency for every consumer of this library — and a `Section` that quietly
 * rendered a flat colour where the web showed a gradient would be worse than
 * one that does not offer it. A caller who wants a gradient composes it.
 */
const backgroundClasses: Record<SectionBackground, string> = {
  none: 'bg-transparent',
  default: 'bg-muted',
  surface: 'bg-card',
};

/**
 * Section Component
 *
 * A full-width band of page content whose inner content is constrained and
 * padded — the vertical rhythm of a page, and the counterpart of
 * `Section` in `@sudobility/components`.
 *
 * The section itself spans the full width so a background reaches the edges,
 * while the inner container is what holds the content in. `fullWidth` skips
 * that container for sections that manage their own inner layout.
 *
 * Unlike the web version there is no `LayoutProvider` to inherit a width from,
 * so `maxWidth` defaults to the `Container`'s own default rather than a page
 * mode.
 *
 * @example
 * ```tsx
 * <Section spacing="lg" background="surface">
 *   <Heading>Instruments</Heading>
 * </Section>
 * ```
 */
export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  spacing = '3xl',
  background = 'none',
  maxWidth,
  className,
  containerClassName,
  fullWidth = false,
}) => {
  return (
    <View
      className={cn(
        'w-full',
        variantClasses[variant],
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      {fullWidth ? (
        children
      ) : (
        <Container
          {...(maxWidth ? { size: maxWidth } : {})}
          {...(containerClassName ? { className: containerClassName } : {})}
        >
          {children}
        </Container>
      )}
    </View>
  );
};
