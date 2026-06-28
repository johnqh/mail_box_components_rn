import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Modal, Animated } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

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

// Lazily derive tooltip colors from DS to avoid ESM issues in tests.
let _tooltipColors: Record<string, string> | null = null;
function getTooltipColors() {
  if (!_tooltipColors) {
    const btn = colors.component.button;
    // Extract bg-* from DS button base for solid tooltip backgrounds
    function extractBg(base: string, darkStr: string) {
      const bg =
        base
          .split(' ')
          .find(
            c =>
              c.startsWith('bg-') &&
              !c.includes('hover:') &&
              !c.includes('active:')
          ) || '';
      const darkBg =
        darkStr
          .split(' ')
          .find(
            c =>
              c.startsWith('dark:bg-') &&
              !c.includes('hover:') &&
              !c.includes('active:')
          ) || '';
      return `${bg} ${darkBg}`;
    }
    _tooltipColors = {
      default: 'bg-popover dark:bg-muted',
      info: extractBg(btn.primary.base, btn.primary.dark),
      success: extractBg(btn.success.base, btn.success.dark),
      warning: 'bg-warning dark:bg-warning', // DS has no yellow button; local fallback
      error: extractBg(btn.destructive.base, btn.destructive.dark),
    };
  }
  return _tooltipColors;
}

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
  const variantClasses = getTooltipColors();

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

      <Modal
        visible={isVisible}
        transparent
        animationType='none'
        onRequestClose={hideTooltip}
      >
        <Pressable className='flex-1' onPress={hideTooltip}>
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
                variantClasses[variant],
                className
              )}
            >
              <Text
                className={`${designTokens.typography.size.xs} ${designTokens.typography.weight.medium} text-white`}
              >
                {content}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};
