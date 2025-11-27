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
│   │   ├── Alert/
│   │   ├── Badge/
│   │   ├── Box/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Checkbox/
│   │   ├── Divider/
│   │   ├── Flex/
│   │   ├── HelperText/
│   │   ├── Input/
│   │   ├── Label/
│   │   ├── Spinner/
│   │   ├── Stack/
│   │   ├── Switch/
│   │   └── TextArea/
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
import {
  Button, Card, Input, Spinner, Alert,
  Box, Flex, Stack, VStack, HStack,
  Label, TextArea, Checkbox, Switch, HelperText,
  Badge, Divider
} from '@sudobility/components-rn';

export function MyScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subscribe, setSubscribe] = useState(false);

  return (
    <Card variant="elevated" padding="md">
      <VStack spacing="md">
        <Box>
          <Label>Email Address</Label>
          <Input placeholder="Enter your email" onChangeText={setEmail} />
          <HelperText>We'll never share your email</HelperText>
        </Box>

        <Box>
          <Label>Message</Label>
          <TextArea
            value={message}
            onChangeText={setMessage}
            placeholder="Write your message..."
            showCount
            maxLength={500}
          />
        </Box>

        <Checkbox
          checked={subscribe}
          onChange={setSubscribe}
          label="Subscribe to newsletter"
        />

        <Flex justify="between" align="center">
          <Badge variant="success">Active</Badge>
          <Switch checked={subscribe} onCheckedChange={setSubscribe} />
        </Flex>

        <Divider label="OR" />

        <Button variant="primary" onPress={handleSubmit}>
          Submit
        </Button>
      </VStack>
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

### Main Package

**Core UI:**
- Button - Pressable button with variants (primary, secondary, outline, ghost, link, destructive)
- Card - Container with CardHeader, CardContent, CardFooter
- Input - Text input with variants and states
- Spinner - Loading indicator with size variants
- Alert - Notification with AlertTitle, AlertDescription

**Layout:**
- Box - Fundamental layout primitive with spacing, sizing, styling props
- Flex - Flexbox layout component with direction, align, justify, gap props
- Stack / VStack / HStack - Flexbox-based layout for arranging children with spacing
- Divider - Visual separator with optional label

**Form:**
- Label - Text label for form inputs
- TextArea - Multi-line text input with character counting
- Checkbox - Custom styled checkbox with controlled/uncontrolled modes
- Switch - Toggle switch with smooth animation
- HelperText - Form field descriptions and error messages

**Display:**
- Badge - Status/label component for metadata, tags, counts

### Specialized Packages

- **DevOps**: SystemStatusIndicator
- **Email**: ContactCard
- **Web3**: AddressLabel, WalletIcon
- **Marketing**: FeatureListItem, WelcomeScreen

## License

MIT
