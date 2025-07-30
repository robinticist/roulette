# @robinticistjs/roulette

A customizable roulette component library for React and Next.js.

## Installation

```bash
# Using pnpm (recommended)
pnpm add @robinticistjs/roulette

# Using npm
npm install @robinticistjs/roulette

# Using yarn
yarn add @robinticistjs/roulette
```

## Features

- 🎡 Animated spinning roulette wheel
- 🎯 Customizable design
- 🔄 Async event handling support
- 📱 Responsive design
- ⚡ Perfect compatibility with Next.js and React

## Usage

### Basic Example

```tsx
import { Roulette } from '@robinticistjs/roulette';

function MyComponent() {
    // Fetch results from server or other operations
    // You can determine the weighting of the results either on the server or here.
    const handleSpinStart = async () => {
    return Math.floor(Math.random() * 10);
  };

  const handleSpinEnd = (value: number) => {
    console.log('Spin ended with value:', value);
  };
  return (
    <Roulette
      items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      onSpinStart={handleSpinStart}
      onSpinEnd={handleSpinEnd}
    />
  );
}
```

### Props

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `items` | `number[]` | Required | - | Array of items to display on the roulette |
| `onSpinStart` | `() => Promise<number>` | Optional | - | Function called when spinning starts, should return the winning item index |
| `onSpinEnd` | `(value: number) => void` | Optional | - | Function called when spinning ends |
| `disabled` | `boolean` | Optional | `false` | Whether the roulette is disabled |
| `remainSecond` | `number` | Optional | `0` | Remaining time (timestamp) |

## Styling

This component is styled using Tailwind CSS. If you don't have Tailwind CSS installed in your project, please install it:

```bash
pnpm add -D tailwindcss
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build
pnpm build

# Watch mode for automatic rebuilds
pnpm build:watch
```

## License

MIT