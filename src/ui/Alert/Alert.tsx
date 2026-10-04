import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import {
  extractTextColorClasses,
  stripTextColorClasses,
} from '../../lib/text-color';
import { resolveIconColor, useIconColor } from '../../lib/icon-color';
import { variants as v, textVariants } from '@sudobility/design';

/**
 * Props for the Alert component.
 *
 * Supports semantic variants (info, success, warning, attention, error)
 * with design system styling, optional custom icons, and compound content.
 */
export interface AlertProps extends ViewProps {
  variant?: 'info' | 'success' | 'warning' | 'attention' | 'error';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

// Default icons as simple text - can be replaced with react-native-heroicons
const defaultIcons: Record<string, string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠️',
  attention: '🔔',
  error: '✕',
};

/*
  The variant's text colour. On the web the alert's `text-info` (and the
  rest) cascades to the title, the description and the icon; React Native has
  no inheritance, so `Alert` lifts the colour off its container and hands it
  down — through this context to `AlertTitle`/`AlertDescription` used as
  children, too. Empty outside an `Alert`, where the text keeps its own.
*/
const AlertTextColorContext = React.createContext('');

/** A text variant with the alert's colour in place of its own. */
function alertText(variantClass: string, alertColor: string): string {
  return alertColor
    ? cn(stripTextColorClasses(variantClass), alertColor)
    : variantClass;
}

/** Alert title sub-component with bold font styling. */
export const AlertTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const color = React.useContext(AlertTextColorContext);
  return (
    <Text
      className={cn(
        alertText(textVariants.label.default(), color),
        'mb-1',
        className
      )}
    >
      {children}
    </Text>
  );
};

/** Alert description sub-component with smaller text styling. */
export const AlertDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const color = React.useContext(AlertTextColorContext);
  return (
    <Text className={cn(alertText(textVariants.body.sm(), color), className)}>
      {children}
    </Text>
  );
};

/** The token behind each variant's colour, for an icon that takes a `color`. */
const VARIANT_TOKEN = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  attention: 'warning',
  error: 'destructive',
} as const;

/**
 * Alert component for React Native
 *
 * The variant's colour is drawn on the title, the description and the
 * default icon, as the web alert's cascades to them. A custom `icon` element
 * with no `color` of its own is given the variant's colour (see
 * `resolveIconColor`).
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Success!" description="Your changes have been saved." />
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  icon,
  children,
  className,
  ...props
}) => {
  const alertClass =
    typeof v.alert[variant] === 'function' ? v.alert[variant]() : '';
  const textColor = extractTextColorClasses(alertClass);
  const iconColor = useIconColor(VARIANT_TOKEN[variant] ?? 'foreground');

  const IconComponent = icon ? (
    resolveIconColor(icon, iconColor)
  ) : (
    <Text className={cn('text-lg', textColor)}>{defaultIcons[variant]}</Text>
  );

  return (
    <View
      className={cn(alertClass, 'flex-row items-start gap-3', className)}
      accessibilityRole='alert'
      {...props}
    >
      {IconComponent && <View className='flex-shrink-0'>{IconComponent}</View>}
      <View className='flex-1'>
        <AlertTextColorContext.Provider value={textColor}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {children}
        </AlertTextColorContext.Provider>
      </View>
    </View>
  );
};
