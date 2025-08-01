# @robinticistjs/roulette

A customizable roulette component library for React and Next.js implemented with pure CSS.

## Installation

```bash
# Using pnpm (recommended)
pnpm add @robinticistjs/roulette

# Using npm
npm install @robinticistjs/roulette

# Using yarn
yarn add @robinticistjs/roulette
```

### Dependencies

This component is implemented with pure CSS without relying on external CSS frameworks. No additional style dependencies are required.

## Demo
[Spin the roulette wheel](https://nk-space.net/en/portfolio/roulette)

## Features

- 🎡 Animated spinning roulette wheel
- 🎯 Customizable design
- 🔄 Async event handling support
- 📱 Responsive design
- ⚡ Perfect compatibility with Next.js and React
- 🚀 Pure CSS implementation without external dependencies

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
| `width` | `string` | Optional | `330px` | Width of the roulette |
| `height` | `string` | Optional | `330px` | Height of the roulette |
| `outerBorderColor` | `string` | Optional | `#e12afb` | Color of the outer border |
| `dotColor` | `string` | Optional | `#ffdf20` | Color of the dots |
| `dotBorderColor` | `string` | Optional | `#9ca3af` | Color of the dot borders |
| `markerColor` | `string` | Optional | `#F44225` | Color of the marker arrow |
| `buttonBorderColor` | `string` | Optional | `#f87171` | Color of the button border |
| `buttonBgColor` | `string` | Optional | `#ff4d4d` | Color of the button background |
| `buttonHoverBorderColor` | `string` | Optional | `#ef4444` | Color of the button border on hover |
| `buttonHoverBgColor` | `string` | Optional | `#dc2626` | Color of the button background on hover |
| `buttonDisabledBgColor` | `string` | Optional | `#b91c1c` | Color of the button background when disabled |
| `sectionColors` | `[string, string]` | Optional | `['#ffffff', '#e5e7eb']` | Colors for even and odd sections |
| `textColor` | `string` | Optional | `#000000` | Color of the text |

## Styling

### Styling Methods

This component can be styled in two ways:

#### Method 1: Automatic Style Application

When you import the component, the default styles are automatically applied.

```tsx
import { Roulette } from '@robinticistjs/roulette';

function MyComponent() {
  return <Roulette items={[1, 2, 3, 4, 5]} />;
}
```

#### Method 2: Direct Style Import

If you want to control the styles directly, you can explicitly import the CSS file.

```tsx
// Import styles in your application's top-level file
import '@robinticistjs/roulette/styles.css';
import { Roulette } from '@robinticistjs/roulette';

function MyComponent() {
  return <Roulette items={[1, 2, 3, 4, 5]} />;
}
```

### Color Customization Example

You can easily customize the colors of the roulette component through props:

```tsx
import { Roulette } from '@robinticistjs/roulette';

function MyComponent() {
  return (
    <Roulette
      items={[1, 2, 3, 4, 5]}
      width="400px"
      height="400px"
      outerBorderColor="#3b82f6"
      dotColor="#fbbf24"
      markerColor="#ef4444"
      buttonBgColor="#10b981"
      buttonBorderColor="#059669"
      sectionColors={['#f9fafb', '#e5e7eb']}
    />
  );
}
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