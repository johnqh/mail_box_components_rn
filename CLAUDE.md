# mail_box_components_rn - AI Development Guide

## Overview

`@sudobility/components-rn` is a React Native UI component library built with TypeScript, Vite, and NativeWind v4. It provides 90+ reusable components ported from `@sudobility/components`, with design tokens and theming imported from `@sudobility/design`. The library follows a monorepo architecture with 10 domain-specific sub-packages under `packages/`.

- **Package name:** `@sudobility/components-rn`
- **Version:** 1.0.21
- **License:** BUSL-1.1
- **Package manager:** Bun (always use `bun` instead of `npm`/`yarn`)
- **Framework:** React 18/19, React Native >= 0.72, TypeScript 5.6+, NativeWind v4
- **Module Format:** ES Module + CommonJS

## Project Structure

```
mail_box_components_rn/
├── src/
│   ├── index.ts                  # Main entry point with all exports
│   ├── lib/
│   │   └── utils.ts              # cn() utility (clsx wrapper, no tailwind-merge)
│   ├── nativewind-env.d.ts       # NativeWind TypeScript declarations (className on RN types)
│   └── ui/                       # 90+ UI component directories
│       ├── ActionButton/
│       ├── AddressLink/
│       ├── Alert/
│       ├── AnimatedCounter/
│       ├── AnimatedSection/
│       ├── AspectFitView/
│       ├── AspectRatio/
│       ├── Avatar/
│       ├── Backdrop/
│       ├── Badge/
│       ├── Banner/
│       ├── Box/
│       ├── Breadcrumb/
│       ├── BreadcrumbNav/
│       ├── Button/            # Includes Button.shared.ts for cross-platform logic
│       ├── CTASection/
│       ├── Calendar/
│       ├── Card/
│       ├── Center/
│       ├── ChainBadge.tsx     # Single-file component (no directory)
│       ├── Checkbox/
│       ├── Code/
│       ├── CodeDisplay/
│       ├── CollapsibleSection/
│       ├── Combobox/
│       ├── Command/
│       ├── Container/
│       ├── DashboardStatCard/
│       ├── DataList/
│       ├── DateInput/
│       ├── DateTimePicker/
│       ├── Dialog/
│       ├── Divider/
│       ├── Dropdown/
│       ├── EmptyState/
│       ├── ExternalLink/
│       ├── FeatureCard/
│       ├── FeatureGrid/
│       ├── FileInput/
│       ├── Flex/
│       ├── FloatingPanel/
│       ├── FormAlerts/
│       ├── FormattedNumber/
│       ├── GradientIconContainer/
│       ├── Grid/
│       ├── Heading/
│       ├── HelperText/
│       ├── IconContainer/
│       ├── IconText/
│       ├── InfiniteScroll/
│       ├── InfoBox/
│       ├── Input/
│       ├── Kbd/
│       ├── KeyValuePair/
│       ├── Label/
│       ├── Link/
│       ├── List/
│       ├── ListItemWithAction/
│       ├── LoadingDots/
│       ├── LoadingOverlay/
│       ├── Logo/
│       ├── Masonry/
│       ├── MasterDetailLayout/
│       ├── Modal/
│       ├── MultiSelect/
│       ├── NavigationList/
│       ├── NumberInput/
│       ├── Overlay/
│       ├── PageContainer/
│       ├── PageHeader/
│       ├── PageSectionHeader/
│       ├── Pagination/
│       ├── PhoneInput/
│       ├── Popover/
│       ├── Progress/
│       ├── ProgressCircle/
│       ├── PromotionalBanner/
│       ├── QuickActions/
│       ├── ScrollArea/
│       ├── ScrollSpy/
│       ├── SearchInput/
│       ├── SectionBadge/
│       ├── SectionHeader/
│       ├── Select/
│       ├── Separator/
│       ├── SettingsList/
│       ├── Sheet/
│       ├── SideNav/
│       ├── Skeleton/
│       ├── SmartLink/
│       ├── Spacer/
│       ├── Spinner/
│       ├── SplitPane/
│       ├── Stack/
│       ├── StandardPageLayout/
│       ├── StatDisplay/
│       ├── StepList/
│       ├── Switch/
│       ├── Table/
│       ├── Tabs/
│       ├── Text/
│       ├── TextArea/
│       ├── TextInputModal/
│       ├── TimePicker/
│       ├── Toast/
│       ├── Tooltip/
│       ├── TransferList/
│       ├── TreeView/
│       ├── TruncatedText/
│       ├── VirtualList/
│       └── VisuallyHidden/
├── packages/                     # Domain-specific sub-packages
│   ├── analytics-components-rn/  # Analytics (stub, components TBD)
│   ├── auth-components-rn/       # Authentication (AuthProvider, AuthScreen, etc.)
│   ├── devops-components-rn/     # DevOps (SystemStatusIndicator, BuildLog, etc.)
│   ├── email-components-rn/      # Email (ContactCard, EmailAccountsList, etc.)
│   ├── entity-components-rn/     # Entity/Org (EntityCard, MemberList, etc.)
│   ├── marketing-components-rn/  # Marketing (WelcomeScreen, FeatureListItem, etc.)
│   ├── ratelimit-components-rn/  # Rate limiting (UsageDashboard, TierComparison)
│   ├── social-components-rn/     # Social (RatingStars, ShareButtons)
│   ├── subscription-components-rn/ # Subscriptions (SubscriptionTile, PeriodSelector)
│   └── web3-components-rn/       # Web3 (WalletIcon, AddressLabel, TokenSwap, etc.)
├── dist/                         # Build output
├── eslint.config.js              # ESLint flat config
├── .prettierrc                   # Prettier config
├── tailwind.config.js            # NativeWind/Tailwind config
├── tsconfig.json                 # TypeScript config (strict mode)
├── vite.config.ts                # Vite library build config
├── jest.config.cjs               # Jest test config
└── package.json                  # Root package with workspaces
```

## Component Categories

### Core UI (`src/ui/`)

| Category | Components |
|----------|-----------|
| **Core** | Button, Card (CardHeader, CardContent, CardFooter), Input, Spinner, Alert (AlertTitle, AlertDescription), ActionButton, Banner |
| **Layout** | Box, Flex, Stack, Divider, Separator, Container, Center, Spacer, Grid, MasterDetailLayout (MasterListItem), SplitPane, PageContainer, FloatingPanel, StandardPageLayout, Masonry |
| **Form** | Label, TextArea, Checkbox, Switch, HelperText, Select, SearchInput, NumberInput, PhoneInput, TimePicker, Combobox, DateInput, DateTimePicker, FileInput, MultiSelect |
| **Typography** | Text, Heading, Code, TruncatedText, CodeDisplay |
| **Display** | Badge, Avatar, Skeleton, List, IconText, FormattedNumber, InfoBox, Kbd, KeyValuePair, StatDisplay, DashboardStatCard, Table, DataList |
| **Feedback** | Progress, ProgressCircle, Modal (ModalHeader, ModalContent, ModalFooter), Toast (ToastProvider, useToast), LoadingOverlay, LoadingDots, Backdrop, FormAlerts |
| **Overlay** | Sheet, Tooltip, Dialog, Popover, Overlay, TextInputModal |
| **Navigation** | Tabs (TabsList, TabsTrigger, TabsContent), Link, Breadcrumb, BreadcrumbNav, Pagination, SettingsList, NavigationList, SideNav, SmartLink, ScrollSpy |
| **Patterns** | Dropdown, AspectRatio, AspectFitView, QuickActions, EmptyState, CollapsibleSection |
| **Badges & Labels** | SectionBadge, ChainBadge |
| **Animation** | AnimatedCounter, AnimatedSection |
| **Icons** | IconContainer, GradientIconContainer |
| **Headers** | PageHeader, PageSectionHeader, SectionHeader |
| **Accessibility** | VisuallyHidden |
| **Advanced** | InfiniteScroll, ExternalLink, ScrollArea, TransferList, ListItemWithAction, VirtualList, Command, TreeView, AddressLink |
| **Features/Marketing** | FeatureCard, FeatureGrid, CTASection, PromotionalBanner |
| **Branding** | Logo |
| **Layout (Page-Level)** | MasterDetailLayout, PageHeader, StandardPageLayout, StepList |

### Specialized Packages (`packages/`)

| Package | Key Exports |
|---------|------------|
| **`@sudobility/auth-components-rn`** | AuthProvider, useAuthStatus, AuthScreen, AuthInline, AuthAction, Avatar, ProviderButtons, EmailSignInForm, EmailSignUpForm, ForgotPasswordForm |
| **`@sudobility/email-components-rn`** | AbTestEmail, ContactCard, EmailAccountsList, EmailAnalytics, EmailCampaign, EmailInputGroup, EmailTemplate, FreeEmailBanner, SubscriberList, SubscriptionPlan |
| **`@sudobility/web3-components-rn`** | AddressLabel, CryptoPortfolio, GasTracker, NftGallery, TokenSwap, WalletConnect, WalletIcon, WalletSelectionButton, WalletSelectionGrid, WalletTab |
| **`@sudobility/devops-components-rn`** | SystemStatusIndicator, DeploymentStatus, BuildLog, MetricsGrid, AuditLog, PipelineView |
| **`@sudobility/marketing-components-rn`** | CrmDashboard, CtaBanner, FeatureListItem, FeatureSpotlight, HeroBannerWithBadge, InternalLink, TopicClusterLinks, RelatedLinks, NpsSurvey, SalesReport, TestimonialSlider, UseCaseGrid, WelcomeScreen |
| **`@sudobility/entity-components-rn`** | EntityCard, EntityList, EntitySelector, MemberList, MemberRoleSelector, InvitationForm, InvitationList |
| **`@sudobility/subscription-components-rn`** | SubscriptionProvider, useSubscription, useIsSubscribed, SubscriptionTile, SubscriptionLayout, SegmentedControl, PeriodSelector |
| **`@sudobility/ratelimit-components-rn`** | UsageDashboard, TierComparisonTable, UsageHistoryChart |
| **`@sudobility/social-components-rn`** | RatingStars, ShareButtons |
| **`@sudobility/analytics-components-rn`** | Stub package (cn utility only, components TBD) |

## Development Commands

```bash
# Install dependencies
bun install

# Build the library (TypeScript compilation + Vite bundling)
bun run build

# Build all packages (root + specialized packages)
bun run build:all

# Build specialized packages only
bun run build:packages

# Development mode with watch
bun run dev

# Type checking without emitting files
bun run type-check

# Linting (ESLint flat config with TypeScript + Prettier rules)
bun run lint

# Format code (Prettier)
bun run format

# Check formatting
bun run format:check

# Run tests (Jest with react-native preset)
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Package preparation (builds before publish)
bun run prepublishOnly
```

## Architecture / Patterns

### Design System Integration

Design tokens are imported from `@sudobility/design` and re-exported from the root `src/index.ts`:

```typescript
import { variants, textVariants, designTokens, colors } from '@sudobility/design';
```

- **`variants`** -- Component style variant functions (e.g., `v.button.primary.default()`, `v.input.default()`, `v.alert.success()`)
- **`textVariants`** -- Typography system (e.g., `textVariants.heading.h4()`, `textVariants.body.sm()`)
- **`designTokens`** -- Spacing, typography, and animation tokens (4px grid)
- **`colors`** -- Semantic color palette with dark mode support

### Component File Convention

Each component lives in its own directory under `src/ui/`:

```
src/ui/ComponentName/
  ├── ComponentName.tsx    # Main component implementation
  └── index.ts             # Barrel export
```

Exception: `ChainBadge.tsx` is a single-file component directly in `src/ui/`.

Some components have additional shared logic files (e.g., `Button/Button.shared.ts` for cross-platform button logic).

### Styling Strategy

1. **`cn()` utility** (`src/lib/utils.ts`) -- Wraps `clsx` for conditional class merging. Unlike the web version, does not use `tailwind-merge` since NativeWind processes classes at build time.

2. **NativeWind v4** -- Tailwind CSS classes applied via `className` prop on React Native components. The `nativewind-env.d.ts` file augments RN types to accept `className` on View, Text, Pressable, TextInput, FlatList, SectionList, ActivityIndicator, Switch, SafeAreaView, KeyboardAvoidingView, Modal, and more.

3. **Variant maps** -- Most components define variant/size/color classes as plain objects within the component file:
   ```typescript
   const variantClasses = {
     default: 'bg-gray-100 dark:bg-gray-700',
     primary: 'bg-blue-100 dark:bg-blue-900/30',
     success: 'bg-green-100 dark:bg-green-900/30',
   };
   ```

4. **Design system variants** -- Some core components (Button, Input, Alert, Card) call variant functions from `@sudobility/design` directly:
   ```typescript
   import { variants as v } from '@sudobility/design';
   // Usage: v.input.default(), v.button.primary.default()
   ```

5. **Dark mode** -- Supported universally via Tailwind `dark:` prefix classes.

### Props Conventions

- All components accept `className?: string` for custom styling override
- Components extend appropriate RN base types (e.g., `ViewProps`, `TextInputProps`)
- Common prop patterns:
  - `variant` -- Visual style variant (e.g., `'default' | 'primary' | 'success'`)
  - `size` -- Size variant (e.g., `'sm' | 'md' | 'lg'`)
  - `disabled` / `loading` -- State flags
  - `onPress` -- Press handler (not `onClick`)
  - `children` -- Content
- Props interfaces are exported alongside components (e.g., `CardProps`, `ButtonProps`)

### Accessibility

- Components use RN accessibility props: `accessibilityRole`, `accessibilityLabel`, `accessibilityState`
- Interactive elements use `Pressable` (not `TouchableOpacity`) for accessibility
- The `VisuallyHidden` component is available for screen-reader-only content

### React Native Adaptations (from web)

| Web | React Native |
|-----|-------------|
| `<div>` | `<View>` |
| `<button>` | `<Pressable>` |
| `<span>`, `<p>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `onClick` | `onPress` |
| ARIA attributes | `accessibilityRole`, `accessibilityLabel`, `accessibilityState` |
| CSS animations | `Animated` API or `react-native-reanimated` |
| `<select>` | Custom `Select` component with `Modal` + `FlatList` |

### Compound Components

Several components use the compound component pattern with React Context:

- **Tabs**: `Tabs` > `TabsList` > `TabsTrigger` + `TabsContent` (uses `TabsContext`)
- **Toast**: `ToastProvider` wraps app, `useToast()` hook exposes `addToast`/`removeToast`
- **Card**: `Card` > `CardHeader` + `CardContent` + `CardFooter`
- **Modal**: `Modal` > `ModalHeader` + `ModalContent` + `ModalFooter`

### Controlled/Uncontrolled Pattern

Components like `Tabs` support both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes.

### Animation

- `Animated` API from `react-native` for basic animations (Sheet slide, Dialog scale, Toast enter, Progress indeterminate)
- `PanResponder` for gesture support (Sheet drag-to-dismiss)
- `react-native-reanimated` listed as peer dependency for advanced animation needs

### Build Configuration

- **Vite** -- Library mode bundling with ES and CJS output formats
- **TypeScript** -- Strict mode, ES2020 target, bundler module resolution, declaration files with source maps
- **Path alias** -- `@/` maps to `src/`
- **Externals** -- React, React Native, NativeWind, `@sudobility/design`, clsx, CVA are all externalized
- **Metro resolution** -- `"react-native"` field in package.json points to `src/index.ts` for Metro bundler
- **Source maps** -- Enabled (`sourcemap: true`)
- **Minification** -- Disabled (`minify: false`) for library consumers to optimize themselves

### Build Output

```
dist/
  ├── index.esm.js          # ES module build
  ├── index.cjs.js           # CommonJS build
  ├── index.d.ts             # TypeScript declarations
  └── ...                    # Source maps + declaration maps
```

### Code Style

- **Prettier**: Single quotes, JSX single quotes, 2-space tabs, semicolons, trailing commas (ES5), 80 char print width, no arrow parens for single args
- **ESLint**: Flat config with TypeScript strict rules, React Hooks rules, Prettier integration
- **Naming**: PascalCase for components, camelCase for hooks/utils, kebab-case for package names
- **Unused vars**: Prefix with `_` to suppress errors (e.g., `_animated`)

## Common Tasks

### Adding a New Core Component

1. Create directory: `src/ui/MyComponent/`
2. Create component file `src/ui/MyComponent/MyComponent.tsx`:
   ```typescript
   import * as React from 'react';
   import { View, Text } from 'react-native';
   import { cn } from '../../lib/utils';

   export interface MyComponentProps {
     variant?: 'default' | 'primary';
     size?: 'sm' | 'md' | 'lg';
     className?: string;
     children: React.ReactNode;
   }

   export const MyComponent: React.FC<MyComponentProps> = ({
     variant = 'default',
     size = 'md',
     className,
     children,
   }) => {
     return (
       <View
         className={cn('rounded-lg p-4', className)}
         accessibilityRole='summary'
       >
         {children}
       </View>
     );
   };
   ```
3. Create barrel file `src/ui/MyComponent/index.ts`:
   ```typescript
   export { MyComponent, type MyComponentProps } from './MyComponent';
   ```
4. Add export to `src/index.ts`:
   ```typescript
   export * from './ui/MyComponent';
   ```
5. Run `bun run type-check` and `bun run lint` to verify.

### Working with Design System Variants

```typescript
import { variants as v, textVariants } from '@sudobility/design';

// Button variant
const buttonClass = v.button.primary.default();

// Text variant
const headingClass = textVariants.heading.h4();

// Card variant colors
import { getCardVariantColors } from '@sudobility/design';
const cardClass = getCardVariantColors('elevated');
```

### Porting a Component from Web (`@sudobility/components`)

1. Replace HTML elements with RN equivalents (div -> View, button -> Pressable, span -> Text)
2. Convert `onClick` to `onPress`
3. Replace ARIA attributes with RN accessibility props
4. Use NativeWind classes (most Tailwind classes work directly)
5. For `<select>`, implement as Modal + FlatList pattern (see `Select.tsx`)
6. For animations, use RN `Animated` API instead of CSS transitions
7. Test on both iOS and Android

## Peer / Key Dependencies

### Peer Dependencies (required by consumers)

| Dependency | Version | Purpose |
|-----------|---------|---------|
| `@sudobility/design` | ^1.1.19 | Design tokens, colors, typography, variants |
| `@sudobility/types` | ^1.9.53 | Shared TypeScript types |
| `react` | ^18.0.0 or ^19.0.0 | React framework |
| `react-native` | >=0.72.0 | React Native runtime |
| `nativewind` | >=4.0.0 | Tailwind CSS for React Native |
| `react-native-gesture-handler` | >=2.0.0 | Gesture handling |
| `react-native-reanimated` | >=3.0.0 | Advanced animations |
| `react-native-safe-area-context` | >=4.0.0 | Safe area insets |
| `react-native-svg` | >=13.0.0 | SVG support |
| `class-variance-authority` | ^0.7.0 | Component variant management |
| `clsx` | ^2.0.0 | Conditional class merging |

### Dev Dependencies (key)

| Dependency | Purpose |
|-----------|---------|
| `typescript` ^5.6.0 | TypeScript compiler |
| `vite` ^6.0.0 | Library bundler |
| `vite-plugin-dts` ^4.3.0 | Declaration file generation |
| `eslint` ^9.15.0 | Linting (flat config) |
| `prettier` ^3.4.0 | Code formatting |
| `jest` ^29.7.0 | Testing framework |
| `@testing-library/react-native` ^13.3.3 | Component testing |

### Sub-Package Peer Dependencies

Each specialized package (`packages/*`) requires:
- `@sudobility/components-rn` ^1.0.0
- `@sudobility/design` ^1.1.0
- `react` ^18.0.0 or ^19.0.0
- `react-native` >=0.72.0
