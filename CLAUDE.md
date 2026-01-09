# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a React Native component library (`@sudobility/components-rn`) built
with TypeScript, Vite, and NativeWind. It provides reusable UI components
ported from `@sudobility/components`, with design system functionality
imported from `@sudobility/design`.

## Package Manager

**This project uses Bun as the package manager.** Always use `bun` commands instead of `npm`:

```bash
# Install dependencies
bun install

# Run any script
bun run <script-name>
```

## Common Development Commands

```bash
# Build the library (TypeScript compilation + Vite bundling)
bun run build

# Build all packages (main + specialized)
bun run build:all

# Development mode with watch
bun run dev

# Type checking without emitting files
bun run type-check

# Linting (ESLint with TypeScript rules)
bun run lint

# Format code
bun run format

# Package preparation
bun run prepublishOnly
```

## Architecture

### Multi-Package Structure

This project uses a **monorepo architecture** with Bun workspaces:

1. **`@sudobility/components-rn`** (root) - Core React Native UI components
2. **`@sudobility/design`** (`../design_system`) - Design tokens, colors,
   typography, variants
3. **Specialized packages** (`packages/`) - Domain-specific components

### Source Structure

- `src/index.ts` - Main library entry point with comprehensive exports
- `src/lib/` - Core utilities (`cn` function)
- `src/ui/` - UI component implementations (Button, Card, Input, etc.)
- `packages/` - Specialized component packages

### Specialized Packages

- `packages/devops-components-rn/` - DevOps monitoring & deployment components
- `packages/email-components-rn/` - Email marketing & contact components
- `packages/web3-components-rn/` - Web3 wallet & crypto components
- `packages/marketing-components-rn/` - Marketing & landing page components

### Component Categories

**Core UI Components** (`src/ui/`):

- Button - Pressable button with variants
- Card - Container with CardHeader, CardContent, CardFooter
- Input - Text input with variants
- Spinner - Loading indicator
- Alert - Notification with AlertTitle, AlertDescription

**Specialized Components** (in respective packages):

- DevOps: SystemStatusIndicator
- Email: ContactCard
- Web3: AddressLabel, WalletIcon
- Marketing: FeatureListItem, WelcomeScreen

### Build Configuration

- **Vite** - Library bundling with ES and CJS formats
- **TypeScript** - Strict compilation with declaration files
- **NativeWind v4** - Tailwind CSS for React Native
- **Path Alias** - `@/` maps to `src/`
- **External Dependencies** - React, React Native externalized

## Key Implementation Details

### Design System Integration

The design system is imported from `@sudobility/design` and includes:

- **Colors** - Semantic color palette with dark mode support
- **Design Tokens** - Spacing, typography, animation tokens (4px grid)
- **Typography** - Text variants and semantic typography system
- **Variants** - Component style variants and utilities

### Component Styling Strategy

- Uses `cn()` utility for conditional class merging (clsx only, no
  tailwind-merge for RN)
- Component variants defined through `class-variance-authority` (CVA)
- NativeWind for Tailwind CSS in React Native
- Accessibility via React Native accessibility props

### React Native Adaptations

- Web: `onClick` → RN: `onPress`
- Web: `<div>` → RN: `<View>`
- Web: `<button>` → RN: `<Pressable>`
- Web: `<span>` → RN: `<Text>`
- ARIA attributes → RN accessibility props (`accessibilityRole`,
  `accessibilityLabel`, etc.)

### Library Build Output

- ES modules (`dist/index.esm.js`)
- CommonJS (`dist/index.js`)
- TypeScript declarations with source maps
- Source files included for Metro bundler resolution

## Development Workflow

### Adding New Components

1. Create component in appropriate directory (`src/ui/` for UI)
2. Use NativeWind classes for styling
3. Export from respective index files and main `src/index.ts`
4. Include accessibility props

### Working with Design System

- Design system is in separate `../design_system` package
- Uses platform-specific exports (`.native.ts` files)
- Import design tokens:
  `import { designTokens, colors, variants } from '@sudobility/design'`
- Use `cn()` utility for conditional styling:
  `cn('base-classes', condition && 'conditional-class')`

### Porting from Web Components

When porting components from `@sudobility/components`:

1. Replace HTML elements with React Native equivalents
2. Convert onClick to onPress
3. Replace ARIA with accessibility props
4. Use NativeWind for styling (mostly same classes work)
5. Use CVA for variant management

### Package Dependencies

Each specialized package has these peer dependencies:

- `@sudobility/components-rn` - Core components
- `@sudobility/design` - Design system
- `react` - React 18+
- `react-native` - React Native 0.72+
