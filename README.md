# @sudobility/components-rn

React Native component library for Sudobility, ported from [@sudobility/components](../mail_box_components).

## Structure

This project mirrors the structure of `@sudobility/components`:
- **Root** (`/`) - Main package `@sudobility/components-rn`
- **`/packages/`** - Specialized component packages

```
mail_box_components_rn/
├── src/                              # @sudobility/components-rn source
│   ├── ui/                           # Core UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Spinner/
│   │   └── Alert/
│   ├── lib/                          # Utilities (cn function)
│   └── index.ts
├── packages/                         # Specialized packages
│   ├── devops-components-rn/         # @sudobility/devops-components-rn
│   ├── email-components-rn/          # @sudobility/email-components-rn
│   ├── web3-components-rn/           # @sudobility/web3-components-rn
│   └── marketing-components-rn/      # @sudobility/marketing-components-rn
├── package.json                      # Main package definition + workspaces
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js                # NativeWind config
```

## Tech Stack

- **React Native** (Bare workflow)
- **NativeWind v4** (Tailwind CSS for React Native)
- **React Navigation** (Navigation)
- **TypeScript** (Type safety)
- **npm workspaces** (Monorepo management)

## Getting Started

### Installation

```bash
cd mail_box_components_rn
npm install
npm run build
```

### Using in your app

```bash
npm install @sudobility/components-rn @sudobility/design
```

### Basic Usage

```tsx
import { Button, Card, Input, Spinner, Alert } from '@sudobility/components-rn';

export function MyScreen() {
  return (
    <Card variant="elevated" padding="md">
      <Input placeholder="Enter your email" onChangeText={setEmail} />
      <Button variant="primary" onPress={handleSubmit}>
        Submit
      </Button>
    </Card>
  );
}
```

## Development

```bash
# Build main package
npm run build

# Build all packages (main + specialized)
npm run build:all

# Watch mode
npm run dev

# Type check
npm run type-check
```

## Packages

| Package | Description |
|---------|-------------|
| `@sudobility/components-rn` | Core React Native UI components |
| `@sudobility/devops-components-rn` | DevOps monitoring & deployment |
| `@sudobility/email-components-rn` | Email marketing & contacts |
| `@sudobility/web3-components-rn` | Web3 wallet & crypto |
| `@sudobility/marketing-components-rn` | Marketing & landing pages |

## Current Components

### Main Package (POC)
- Button
- Card (Card, CardHeader, CardContent, CardFooter)
- Input
- Spinner
- Alert (Alert, AlertTitle, AlertDescription)

### Specialized Packages (Sample)
- **DevOps**: SystemStatusIndicator
- **Email**: ContactCard
- **Web3**: AddressLabel, WalletIcon
- **Marketing**: FeatureListItem, WelcomeScreen

## License

MIT
