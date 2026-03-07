# @sudobility/components-rn

React Native UI component library providing 90+ components ported from `@sudobility/components`. Built with TypeScript, Vite, and NativeWind v4. Design tokens and theming from `@sudobility/design`. Includes 10 domain-specific sub-packages under `packages/`.

## Installation

```bash
bun add @sudobility/components-rn @sudobility/design
```

Peer dependencies: `react`, `react-native` (>=0.72), `nativewind` (>=4), `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-svg`, `class-variance-authority`, `clsx`.

## Usage

```tsx
import {
  Button, Card, CardHeader, CardContent, Input, Alert,
  Box, Flex, Stack, Tabs, TabsList, TabsTrigger, TabsContent,
  Badge, Avatar, Spinner, Modal, Select, Switch,
  variants, textVariants, designTokens,
} from '@sudobility/components-rn';

export function MyScreen() {
  return (
    <Card variant="elevated">
      <CardContent>
        <Input placeholder="Enter email" />
        <Button variant="primary" onPress={handleSubmit}>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## API

### Core UI (`src/ui/`) -- 90+ components

- **Layout**: Box, Flex, Stack, Grid, Divider, Separator, Container, Center, Spacer, SplitPane, PageContainer, FloatingPanel, Masonry, MasterDetailLayout
- **Form**: Input, TextArea, Checkbox, Switch, Select, SearchInput, NumberInput, PhoneInput, Combobox, DateInput, DateTimePicker, FileInput, MultiSelect, Label, HelperText, FormAlerts
- **Display**: Badge, Avatar, Skeleton, List, DataList, Table, StatDisplay, DashboardStatCard, KeyValuePair, FormattedNumber, IconText, InfoBox
- **Typography**: Text, Heading, Code, CodeDisplay, TruncatedText, Kbd
- **Feedback**: Spinner, Progress, ProgressCircle, Modal, Toast, LoadingOverlay, LoadingDots, Alert, Backdrop
- **Overlay**: Sheet, Dialog, Popover, Tooltip, Overlay, TextInputModal
- **Navigation**: Tabs, Link, Breadcrumb, BreadcrumbNav, Pagination, NavigationList, SettingsList, SideNav, SmartLink, ScrollSpy
- **Features**: FeatureCard, FeatureGrid, CTASection, PromotionalBanner, AnimatedCounter, AnimatedSection

### Sub-Packages (`packages/`)

| Package | Description |
|---------|-------------|
| `@sudobility/auth-components-rn` | Authentication (AuthProvider, AuthScreen) |
| `@sudobility/email-components-rn` | Email (ContactCard, EmailAccountsList, EmailTemplate) |
| `@sudobility/web3-components-rn` | Web3 (WalletIcon, AddressLabel, TokenSwap, NftGallery) |
| `@sudobility/devops-components-rn` | DevOps (SystemStatusIndicator, PipelineView) |
| `@sudobility/marketing-components-rn` | Marketing (WelcomeScreen, CtaBanner, NpsSurvey) |
| `@sudobility/entity-components-rn` | Entity/Org (EntityCard, MemberList) |
| `@sudobility/subscription-components-rn` | Subscriptions (SubscriptionTile, PeriodSelector) |
| `@sudobility/ratelimit-components-rn` | Rate limiting (UsageDashboard) |
| `@sudobility/social-components-rn` | Social (RatingStars, ShareButtons) |
| `@sudobility/analytics-components-rn` | Analytics (stub, TBD) |

## Development

```bash
bun install
bun run build              # TypeScript + Vite library build
bun run build:all          # Root + all sub-packages
bun run dev                # Watch mode
bun run type-check         # TypeScript checking
bun run lint               # ESLint
bun run test               # Jest with react-native preset
```

## Related Packages

- `@sudobility/design` -- design tokens, colors, typography, variants (peer dependency)
- `@sudobility/types` -- shared TypeScript types (peer dependency)
- `@sudobility/components` -- web version of this library

## License

BUSL-1.1
