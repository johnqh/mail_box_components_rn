import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { ModalHost } from '../ModalHost';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';
import { pressProps } from '../../lib/a11y';

export interface TooltipProps {
  /** Content to display in the tooltip */
  content: string;
  /** Children that trigger the tooltip */
  children: React.ReactNode;
  /** Tooltip placement */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing tooltip (ms) */
  delayShow?: number;
  /** Additional className for tooltip */
  className?: string;
  /** Disable the tooltip */
  disabled?: boolean;
  /** Variant style */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
}

/**
 * Tooltip Component
 *
 * Simple tooltip that appears on long press in React Native.
 * Shows informational content in a floating view.
 *
 * @example
 * ```tsx
 * <Tooltip content="Click to copy">
 *   <Button>Copy</Button>
 * </Tooltip>
 * ```
 *
 * @example
 * ```tsx
 * <Tooltip content="User profile" placement="bottom" variant="info">
 *   <Avatar />
 * </Tooltip>
 * ```
 */

/**
 * Each variant's surface and the text drawn on it, as semantic tokens, so both
 * follow the active theme and its dark mode. The text is the surface's own
 * foreground: a fixed white was unreadable on the light `popover` surface.
 */
const tooltipColors: Record<
  NonNullable<TooltipProps['variant']>,
  { surface: string; text: string }
> = {
  default: {
    surface: 'bg-popover border border-border',
    text: 'text-popover-foreground',
  },
  // The primary surface, as the info tooltip has always drawn.
  info: { surface: 'bg-primary', text: 'text-primary-foreground' },
  success: { surface: 'bg-success', text: 'text-success-foreground' },
  warning: { surface: 'bg-warning', text: 'text-warning-foreground' },
  error: { surface: 'bg-destructive', text: 'text-destructive-foreground' },
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delayShow = 0,
  className,
  disabled = false,
  variant = 'default',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const triggerRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isVisible, fadeAnim]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    if (disabled) return;

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({ x, y, width, height });

      if (delayShow > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true);
        }, delayShow);
      } else {
        setIsVisible(true);
      }
    });
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Variant styles from DS
  const variantColors = tooltipColors[variant];

  // Calculate tooltip position
  const getTooltipPosition = () => {
    const TOOLTIP_OFFSET = 8;
    const TOOLTIP_HEIGHT = 32; // Approximate
    const TOOLTIP_WIDTH = content.length * 8; // Rough estimate

    switch (placement) {
      case 'top':
        return {
          top: position.y - TOOLTIP_HEIGHT - TOOLTIP_OFFSET,
          left: position.x + position.width / 2 - TOOLTIP_WIDTH / 2,
        };
      case 'bottom':
        return {
          top: position.y + position.height + TOOLTIP_OFFSET,
          left: position.x + position.width / 2 - TOOLTIP_WIDTH / 2,
        };
      case 'left':
        return {
          top: position.y + position.height / 2 - TOOLTIP_HEIGHT / 2,
          left: position.x - TOOLTIP_WIDTH - TOOLTIP_OFFSET,
        };
      case 'right':
        return {
          top: position.y + position.height / 2 - TOOLTIP_HEIGHT / 2,
          left: position.x + position.width + TOOLTIP_OFFSET,
        };
      default:
        return { top: 0, left: 0 };
    }
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        onLongPress={showTooltip}
        onPressOut={hideTooltip}
        delayLongPress={300}
      >
        {children}
      </Pressable>

      <ModalHost
        visible={isVisible}
        animationType='none'
        onRequestClose={hideTooltip}
      >
        <Pressable className='flex-1' {...pressProps(hideTooltip)}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                ...getTooltipPosition(),
                opacity: fadeAnim,
              },
            ]}
          >
            <View
              className={cn(
                'px-3 py-2 rounded-lg shadow-lg',
                variantColors.surface,
                className
              )}
            >
              <Text
                className={`${designTokens.typography.size.xs} ${designTokens.typography.weight.medium} ${variantColors.text}`}
              >
                {content}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </ModalHost>
    </>
  );
};
