/**
 * Color variants for usage bars
 */
export type UsageBarColor = 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'gray';

/**
 * Configuration for a single usage bar
 */
export interface UsageBarConfig {
  /** Label for the usage bar (e.g., "Hourly", "Daily", "Monthly") */
  label: string;
  /** Current usage count */
  current: number;
  /** Maximum limit for this period */
  limit: number;
  /** Optional icon name to display */
  icon?: string;
  /** Optional override for the bar color */
  colorOverride?: UsageBarColor;
  /** Optional subtitle text */
  subtitle?: string;
}

/**
 * Props for the UsageDashboard component
 */
export interface UsageDashboardProps {
  /** Array of usage bar configurations to display */
  bars: UsageBarConfig[];
  /** Optional title for the dashboard */
  title?: string;
  /** Optional subtitle for the dashboard */
  subtitle?: string;
  /** Whether to show percentage labels */
  showPercentage?: boolean;
  /** Whether to show the remaining count */
  showRemaining?: boolean;
  /** Optional callback when a bar is pressed */
  onBarPress?: (bar: UsageBarConfig, index: number) => void;
  /** Additional class names */
  className?: string;
}

/**
 * Data for displaying tier information
 */
export interface TierDisplayData {
  /** Name of the tier (e.g., "Free", "Pro", "Enterprise") */
  name: string;
  /** Hourly limit for this tier */
  hourlyLimit: number;
  /** Daily limit for this tier */
  dailyLimit: number;
  /** Monthly limit for this tier */
  monthlyLimit: number;
  /** Optional price string */
  price?: string;
  /** Whether this is the current tier */
  isCurrent?: boolean;
  /** Whether this tier is recommended */
  isRecommended?: boolean;
  /** Optional description */
  description?: string;
  /** Optional additional features list */
  features?: string[];
}

/**
 * Props for the TierComparisonTable component
 */
export interface TierComparisonTableProps {
  /** Array of tiers to compare */
  tiers: TierDisplayData[];
  /** Optional title for the table */
  title?: string;
  /** Callback when a tier is selected */
  onTierSelect?: (tier: TierDisplayData) => void;
  /** Whether to highlight the current tier */
  highlightCurrent?: boolean;
  /** Whether to show the price column */
  showPrice?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Data for a single history entry
 */
export interface HistoryEntryData {
  /** Timestamp or label for this entry */
  timestamp: string | Date;
  /** Usage value at this point */
  value: number;
  /** Optional limit value for comparison */
  limit?: number;
  /** Optional label override */
  label?: string;
}

/**
 * Props for the UsageHistoryChart component
 */
export interface UsageHistoryChartProps {
  /** Array of history entries to display */
  data: HistoryEntryData[];
  /** Title for the chart */
  title?: string;
  /** Height of the chart area */
  height?: number;
  /** Color for the usage line/bars */
  color?: UsageBarColor;
  /** Whether to show the limit line */
  showLimit?: boolean;
  /** Whether to show data point labels */
  showLabels?: boolean;
  /** Display mode: 'line' or 'bar' */
  mode?: 'line' | 'bar';
  /** Callback when a data point is pressed */
  onDataPointPress?: (entry: HistoryEntryData, index: number) => void;
  /** Additional class names */
  className?: string;
}
