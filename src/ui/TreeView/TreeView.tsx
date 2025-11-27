import * as React from 'react';
import { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface TreeNode {
  /** Node ID */
  id: string;
  /** Node label */
  label: string;
  /** Node icon */
  icon?: React.ReactNode;
  /** Child nodes */
  children?: TreeNode[];
  /** Disabled state */
  disabled?: boolean;
}

export interface TreeViewProps {
  /** Tree data */
  data: TreeNode[];
  /** Selected node ID */
  selectedId?: string;
  /** Selection handler */
  onSelect?: (node: TreeNode) => void;
  /** Expanded node IDs */
  expandedIds?: string[];
  /** Expand handler */
  onExpand?: (nodeId: string) => void;
  /** Default expanded */
  defaultExpanded?: boolean;
  /** Show lines */
  showLines?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * TreeView Component
 *
 * Hierarchical tree view with expand/collapse.
 * Supports selection, custom icons, and indentation lines.
 *
 * @example
 * ```tsx
 * <TreeView
 *   data={fileTree}
 *   selectedId={selectedNode}
 *   onSelect={handleSelect}
 *   showLines
 * />
 * ```
 */
export const TreeView: React.FC<TreeViewProps> = ({
  data,
  selectedId,
  onSelect,
  expandedIds: controlledExpandedIds,
  onExpand,
  defaultExpanded = false,
  showLines = false,
  className,
}) => {
  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(
    new Set(defaultExpanded ? data.map(node => node.id) : [])
  );

  const expandedIds =
    controlledExpandedIds !== undefined
      ? new Set(controlledExpandedIds)
      : internalExpandedIds;

  const toggleExpand = useCallback(
    (nodeId: string) => {
      if (controlledExpandedIds !== undefined && onExpand) {
        onExpand(nodeId);
      } else {
        setInternalExpandedIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(nodeId)) {
            newSet.delete(nodeId);
          } else {
            newSet.add(nodeId);
          }
          return newSet;
        });
      }
    },
    [controlledExpandedIds, onExpand]
  );

  const handleSelect = useCallback(
    (node: TreeNode) => {
      if (!node.disabled && onSelect) {
        onSelect(node);
      }
    },
    [onSelect]
  );

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <View key={node.id}>
        {/* Node item */}
        <Pressable
          onPress={() => handleSelect(node)}
          disabled={node.disabled}
          className={cn(
            'flex-row items-center gap-2 px-2 py-1.5 rounded-md',
            !node.disabled && 'active:bg-gray-100 dark:active:bg-gray-800',
            isSelected && 'bg-blue-50 dark:bg-blue-900/30',
            node.disabled && 'opacity-50'
          )}
          style={{ paddingLeft: level * 24 + 8 }}
          accessibilityRole='button'
          accessibilityState={{ selected: isSelected, disabled: node.disabled }}
        >
          {/* Expand/collapse button */}
          {hasChildren ? (
            <Pressable
              onPress={() => toggleExpand(node.id)}
              className='w-4 h-4 items-center justify-center active:bg-gray-200 dark:active:bg-gray-700 rounded'
              hitSlop={8}
              accessibilityRole='button'
              accessibilityLabel={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Text
                className={cn(
                  'text-xs text-gray-600 dark:text-gray-400',
                  isExpanded && 'rotate-90'
                )}
              >
                ▶
              </Text>
            </Pressable>
          ) : (
            <View className='w-4 h-4' />
          )}

          {/* Icon */}
          {node.icon && (
            <View className='w-4 h-4 flex-shrink-0'>{node.icon}</View>
          )}

          {/* Label */}
          <Text
            className={cn(
              'flex-1 text-sm',
              isSelected
                ? 'text-blue-700 dark:text-blue-300 font-medium'
                : 'text-gray-900 dark:text-white'
            )}
          >
            {node.label}
          </Text>
        </Pressable>

        {/* Children */}
        {hasChildren && isExpanded && (
          <View
            className={cn(
              showLines &&
                'border-l-2 border-gray-200 dark:border-gray-700 ml-2'
            )}
          >
            {node.children!.map(child => renderNode(child, level + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View className={cn('w-full', className)}>
      {data.map(node => renderNode(node, 0))}
    </View>
  );
};
