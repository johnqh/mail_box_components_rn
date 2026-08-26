import * as React from 'react';
import type { SelectOption } from './Select';

/**
 * The compositional half of `Select`.
 *
 * `@sudobility/components`' web `Select` is Radix's, so callers write
 *
 * ```tsx
 * <Select value={v} onValueChange={set}>
 *   <SelectTrigger><SelectValue /></SelectTrigger>
 *   <SelectContent>
 *     <SelectGroup>
 *       <SelectLabel>Strings</SelectLabel>
 *       <SelectItem value="violin">Violin</SelectItem>
 *     </SelectGroup>
 *   </SelectContent>
 * </Select>
 * ```
 *
 * React Native has no Radix, and this library's `Select` takes an `options`
 * array instead — which is the better shape for a list picker but means a page
 * ported from the web has to be rewritten around it. These components close
 * that gap: they are **declarative markers**, carrying no rendering of their
 * own, and `CompositionalSelect` walks them into the `options` array the real
 * `Select` wants.
 *
 * So the same JSX compiles on both platforms, and a layout ports across
 * without being restructured. A caller starting fresh on React Native should
 * still prefer the `options` prop; this exists to make porting cheap, not to
 * be the recommended shape.
 */

export interface SelectItemProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/** A single option. Rendered by the parent `Select`, never by itself. */
export const SelectItem: React.FC<SelectItemProps> = () => null;
SelectItem.displayName = 'SelectItem';

export interface SelectLabelProps {
  children?: React.ReactNode;
}

/** A heading over a group of options. */
export const SelectLabel: React.FC<SelectLabelProps> = () => null;
SelectLabel.displayName = 'SelectLabel';

export interface SelectGroupProps {
  children?: React.ReactNode;
}

/** Groups options under a `SelectLabel`. */
export const SelectGroup: React.FC<SelectGroupProps> = () => null;
SelectGroup.displayName = 'SelectGroup';

export interface SelectContentProps {
  children?: React.ReactNode;
}

/** Holds the options. On the web this is the portalled popover. */
export const SelectContent: React.FC<SelectContentProps> = () => null;
SelectContent.displayName = 'SelectContent';

/** The text of a node, for use as an option label. */
function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean')
    return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement(node)) {
    return textOf((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

function displayNameOf(node: React.ReactElement): string | undefined {
  const type = node.type as { displayName?: string } | string;
  return typeof type === 'string' ? undefined : type.displayName;
}

/**
 * Walks a `SelectContent` tree into a flat option array.
 *
 * Groups flatten: this library's `Select` has no group headings, and dropping
 * a heading is better than inventing a divider that the web version does not
 * draw. A caller who needs headings wants `SheetSelector`.
 */
export function optionsFromChildren(children: React.ReactNode): SelectOption[] {
  const options: SelectOption[] = [];
  const walk = (node: React.ReactNode): void => {
    React.Children.forEach(node, child => {
      if (!React.isValidElement(child)) return;
      const name = displayNameOf(child);
      const props = child.props as SelectItemProps & {
        children?: React.ReactNode;
      };
      if (name === 'SelectItem') {
        options.push({
          value: props.value,
          label: textOf(props.children) || props.value,
          ...(props.disabled ? { disabled: true } : {}),
        });
        return;
      }
      // Everything else — Content, Group, a fragment, a conditional — is a
      // container. Labels contribute nothing and fall out here.
      if (name === 'SelectLabel') return;
      walk(props.children);
    });
  };
  walk(children);
  return options;
}

/*
  There is no separate compositional component: `Select` itself accepts either
  shape and calls `optionsFromChildren` when children are present. A second
  component would be a second thing to choose between for no gain.
*/
