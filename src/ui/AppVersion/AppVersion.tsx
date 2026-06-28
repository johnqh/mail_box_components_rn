import * as React from 'react';
import { Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface AppVersionProps {
  /** App display name */
  appName: string;
  /** Version string (e.g. from package.json) */
  version: string;
  /** Additional className */
  className?: string;
}

/**
 * AppVersion Component
 *
 * Displays the app name and version in a muted text style.
 * Reads the version from the consuming app's package.json.
 *
 * @example
 * ```tsx
 * import { version } from '../package.json';
 * <AppVersion appName="MyApp" version={version} />
 * // renders: "MyApp v1.0.0"
 * ```
 */
export const AppVersion: React.FC<AppVersionProps> = ({
  appName,
  version,
  className,
}) => {
  return (
    <Text
      className={cn('text-sm text-muted-foreground text-center', className)}
    >
      {appName} v{version}
    </Text>
  );
};
