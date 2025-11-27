import React from 'react';
import { View, Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface InternalLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
  onPress?: (url: string) => void;
}

const linkVariants = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-green-600 dark:text-green-400',
  subtle: 'text-gray-600 dark:text-gray-400',
};

export const InternalLink: React.FC<InternalLinkProps> = ({
  to,
  children,
  className,
  variant = 'primary',
  onPress,
}) => (
  <Pressable
    onPress={() => onPress?.(to)}
    accessibilityRole="link"
    accessibilityLabel={typeof children === 'string' ? `Navigate to ${children}` : undefined}
  >
    <Text className={cn('underline font-medium', linkVariants[variant], className)}>
      {children}
    </Text>
  </Pressable>
);

type ClusterType = 'gettingStarted' | 'benefits' | 'technical' | 'integration';

export interface TopicClusterLinksProps extends ViewProps {
  cluster: ClusterType;
  context?: string;
  onLinkPress?: (url: string) => void;
}

const WEB3_EMAIL_CLUSTERS: Record<ClusterType, Record<string, string>> = {
  gettingStarted: {
    documentation: '/document#getting-started',
    connect: '/connect',
    features: '/document#email-management',
  },
  benefits: {
    users: '/web3-users',
    projects: '/web3-projects',
    security: '/document#technical-details',
    nameService: '/document#name-service-subscription',
  },
  technical: {
    documentation: '/document',
    apiDocs: '/document#api-documentation',
    smartContracts: '/document#smart-contracts',
    security: '/document#technical-details',
  },
  integration: {
    projects: '/web3-projects',
    delegation: '/document#email-delegation',
    nameService: '/document#name-service-subscription',
    troubleshooting: '/document#troubleshooting',
  },
};

const LINK_TEXTS: Record<ClusterType, Record<string, string>> = {
  gettingStarted: {
    documentation: 'Learn how it works',
    connect: 'Get started now',
    features: 'Explore features',
  },
  benefits: {
    users: 'Benefits for users',
    projects: 'For Web3 projects',
    security: 'Security details',
    nameService: 'ENS/SNS domains',
  },
  technical: {
    documentation: 'Full documentation',
    apiDocs: 'API reference',
    smartContracts: 'Smart contract integration',
    security: 'Technical security',
  },
  integration: {
    projects: 'Integration examples',
    delegation: 'Email delegation',
    nameService: 'Domain setup',
    troubleshooting: 'Troubleshooting guide',
  },
};

export const TopicClusterLinks: React.FC<TopicClusterLinksProps> = ({
  cluster,
  className,
  onLinkPress,
  ...props
}) => {
  const links = WEB3_EMAIL_CLUSTERS[cluster];
  const texts = LINK_TEXTS[cluster];

  return (
    <View className={cn('flex-row flex-wrap gap-2', className)} {...props}>
      {Object.entries(links).map(([key, url], index) => (
        <React.Fragment key={key}>
          <InternalLink to={url} variant="primary" onPress={onLinkPress}>
            {texts[key]}
          </InternalLink>
          {index < Object.keys(links).length - 1 && (
            <Text className="text-gray-400"> • </Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export interface RelatedLinksProps extends ViewProps {
  title?: string;
  links: Array<{
    text: string;
    url: string;
    variant?: 'primary' | 'secondary' | 'subtle';
  }>;
  onLinkPress?: (url: string) => void;
}

export const RelatedLinks: React.FC<RelatedLinksProps> = ({
  title = 'Related:',
  links,
  className,
  onLinkPress,
  ...props
}) => (
  <View
    className={cn(
      'mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800',
      className
    )}
    {...props}
  >
    <View className="flex-row flex-wrap items-center gap-2">
      <Text className="text-sm font-medium text-blue-900 dark:text-blue-200">
        {title}
      </Text>
      {links.map((link, index) => (
        <React.Fragment key={index}>
          <InternalLink
            to={link.url}
            variant={link.variant || 'primary'}
            onPress={onLinkPress}
          >
            {link.text}
          </InternalLink>
          {index < links.length - 1 && (
            <Text className="text-gray-400"> • </Text>
          )}
        </React.Fragment>
      ))}
    </View>
  </View>
);

export const generateContextualLinks = (pageType: string, _userStatus?: string) => {
  const baseLinks: Record<string, Array<{ text: string; url: string }>> = {
    homepage: [
      { text: 'How it works', url: '/document#getting-started' },
      { text: 'User benefits', url: '/web3-users' },
      { text: 'For projects', url: '/web3-projects' },
    ],
    documentation: [
      { text: 'Get started', url: '/connect' },
      { text: 'User guide', url: '/web3-users' },
      { text: 'API docs', url: '/document#api-documentation' },
    ],
    users: [
      { text: 'Start now', url: '/connect' },
      { text: 'Documentation', url: '/document' },
      { text: 'For projects', url: '/web3-projects' },
    ],
    projects: [
      { text: 'API integration', url: '/document#api-documentation' },
      { text: 'Smart contracts', url: '/document#smart-contracts' },
      { text: 'User benefits', url: '/web3-users' },
    ],
  };

  return baseLinks[pageType] || [];
};
