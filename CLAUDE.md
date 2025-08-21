# React Rules

## State Management

### Use `useImmer` for complex state

Prefer `useImmer` over `useState` for objects/arrays:

```javascript
// Good: useImmer - direct mutation
import { useImmer } from 'use-immer';
const [state, updateState] = useImmer({ user: { name: '' } });
updateState(draft => { draft.user.name = 'John'; });

// Bad: useState - verbose spread syntax
const [state, setState] = useState({ user: { name: '' } });
setState(prev => ({ ...prev, user: { ...prev.user, name: 'John' } }));
```

## Performance Hooks

### Avoid `useMemo` and `useCallback` unless necessary

- Don't use `useMemo` or `useCallback` without good reason
- If needed, ask for confirmation or provide clear justification

## Hook Utilities

### Use ahooks over custom implementations

```javascript
// Good: ahooks
import { useRequest, useLocalStorageState, useDebounce } from 'ahooks';
const { data, loading } = useRequest(fetchData);
const [token, setToken] = useLocalStorageState('auth');
const debounced = useDebounce(search, { wait: 300 });

// Bad: custom implementations
const [data, setData] = useState();
const [loading, setLoading] = useState(false);
```

Common hooks: `useRequest`, `useLocalStorageState`, `useSessionStorageState`, `useDebounce`, `useThrottle`, `useInterval`, `useTimeout`, `usePrevious`, `useToggle`, `useBoolean`, `useCounter`. Check [ahooks docs](https://ahooks.js.org/) for more.

# Development Rules

## Internationalization

### All user-facing text must be in English

```jsx
// Good: English UI text
<button>Create Wallet</button>;
throw new Error('Invalid private key format');

// Bad: Chinese UI text
<button>创建钱包</button>;
throw new Error('无效的私钥格式');
```

### Comments should prioritize Chinese

```jsx
// Good: Chinese comments + English UI
// 生成指定数量的钱包
const generateWallets = (count: number) => {
  console.log('钱包生成失败:', error);
  return <button>Create Wallet</button>;
};
```

## File Organization

### Extract business constants and types

- **Business constants** -> `const.tsx` (exclude API paths and Tailwind classes)
- **TypeScript types** -> `types.ts`
- **Local utilities** -> `helper.tsx`

```typescript
// const.tsx
export const WALLET_LIMITS = { MIN_COUNT: 1, MAX_COUNT: 50 };

// helper.tsx
export const generateWallets = (count: number) => {
	// Logic here
};
```

**Structure:**

```
components/wallet-modal/
├── WalletModal.tsx
├── types.ts
├── const.tsx
├── helper.tsx
└── index.ts
```

## Calculation

### Use big.js for All Calculations

Use `big.js` for all precision-related operations, including parsing and conversions:

```javascript
import Big from 'big.js';

// Good: All precision operations use Big.js
const result = new Big('0.1').plus('0.2');
const total = new Big('100.50').times('2.5');
const isEqual = new Big('10.5').eq('10.50'); // true
const parsed = new Big(userInput); // instead of parseFloat
const integer = new Big('123.456').round(0); // instead of parseInt

// Bad: Native JS causes precision loss
const result = 0.1 + 0.2; // 0.30000000000000004
const parsed = parseFloat(userInput); // precision loss
const integer = parseInt('123.456'); // precision loss
```

### Common methods:

- `new Big(value)`, `.plus(n)`, `.minus(n)`, `.times(n)`, `.div(n)`
- `.eq(n)`, `.gt(n)`, `.lt(n)`, `.gte(n)`, `.lte(n)`
- `.toString()`, `.toNumber()`, `.round(dp)`, `.abs()`

For more methods, check Big.js type definitions or [documentation](https://mikemcl.github.io/big.js/).

## Number Display

### Use formatNumber for all number display

```javascript
import { formatNumber } from '@/utils/format-number';

// Good: formatNumber utility
const balance = formatNumber(amount); // Default 'price'
const percent = formatNumber(0.1234, 'percent'); // 12.34
const compact = formatNumber(1500000, 'compact'); // 1.5M

// Bad: Native formatting
const balance = amount.toFixed(4);
```

**Types:** `'price'` (default), `'percent'`, `'compact'`

## Date Display

### Use formatDate for all date display

```javascript
import { formatDate } from '@/utils/format-date';

// Good: formatDate utility
const timestamp = formatDate(new Date()); // Default 'MM/DD HH:mm:ss'
const dateOnly = formatDate(Date.now(), 'YYYY-MM-DD');
const timeOnly = formatDate('2025-08-11', 'HH:mm:ss');

// Bad: Native formatting
const timestamp = new Date().toLocaleDateString();
const formatted = date.getFullYear() + '-' + date.getMonth();
```

**Common formats:** `'MM/DD HH:mm:ss'` (default), `'YYYY-MM-DD'`, `'YYYY/MM/DD'`, `'HH:mm:ss'`, `'YYYY年MM月DD日'`

## UI Component Usage

### Prefer shadcn/ui components over custom implementations

Always use shadcn/ui components when available to maintain design consistency:

```jsx
// Good: Use shadcn/ui Button
import { Button } from '@/components/shadcn-ui/button';

<Button variant="default" size="sm">
  Click me
</Button>

// Bad: Custom button styling
<button className="bg-primary text-primary-foreground px-4 py-2 rounded">
  Click me
</button>
```

### Component availability check

If you need a shadcn/ui component:

1. **Check existing components** in `src/components/shadcn-ui/` first
2. **If component exists** - use it directly
3. **If component missing** - notify developer and suggest installation using shadcn/ui CLI

## Clipboard Operations

### Use project's copyToClipboard utility

```javascript
// Bad: Direct usage
import copy from 'copy-to-clipboard';

import { copyToClipboard } from '@/utils/copyToClipboard';

// Good: Project utility
copyToClipboard(walletAddress);
copyToClipboard(privateKey, {
	successMessage: 'Private key copied',
	showToast: true,
});

const success = copy(text);
```

# TypeScript Rules

## Type Imports/Exports

Use explicit `type` keyword:

```typescript
// Good
import type { UserAPI } from './types';
import { type ReactNode, useState } from 'react';
export type { UserAPI } from './types';

// Bad
import { UserAPI } from './types';
export { UserAPI } from './types';
```

## Declaration File Extensions

For `.d.ts` files, include `.d` extension in imports:

```typescript
// Good
import type { UserAPI } from './types.d';     // for types.d.ts
import type { Config } from './config';       // for config.ts

// Bad
import type { UserAPI } from './types';       // missing .d for .d.ts file
```

# Additional Team Rules

## ESLint Error Handling

Limit fix attempts to avoid time waste:

- Try fixing once
- If still problematic, stop further attempts

## Rule Synchronization

When syncing between cursorrules (.mdc) and claude.md:

- Direct content transfer only, no analysis/modifications
- Watch for encoding differences between .mdc and .md formats to avoid corruption
- Specifically avoid emoji symbols (such as ✅ ❌ etc.) - use text alternatives like "Good:" "Bad:" instead
- These rules guide Cursor and Claude Code for collaborative coding

## Code Optimization Guidelines

### Tailwind CSS Classes

DO NOT extract Tailwind utility classes to constants as "magic numbers":

- Classes like `w-12`, `h-8`, `text-sm`, `p-4` should stay inline
- These are design tokens, not magic numbers
- Extracting them is over-engineering and reduces readability
- Keep Tailwind classes where they are used for better maintainability

# Tailwind CSS Rules

## Avoid `!important` unless absolutely necessary

## Custom Utility Classes

Use custom utilities over verbose combinations:

- `position-full` -> full positioning
- `flex-center` -> flex + center alignment
- `grid-center` -> grid + center alignment
- `z-mask` -> mask layer z-index
- `z-overlay-content` -> overlay content z-index

```jsx
// Good: Custom
<div className="absolute position-full">
<div className="flex-center">
<div className="z-mask">

// Bad: Verbose
<div className="absolute inset-0">
<div className="flex items-center justify-center">
<div className="z-50">
```

## Theme Color Rules

### Strictly Prohibited: Direct Color Values

- NEVER use hex color values (e.g., `#ffffff`)
- NEVER use `rgb()` or `rgba()` functions
- NEVER use Tailwind default color classes (e.g., `text-red-500`, `bg-blue-200`) - the project has completely overridden Tailwind's theme colors configuration, making these default color classes non-existent or non-compliant with design standards

### Only Use Custom Tailwind Color Class Names

```jsx
// Good Usage
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
<div className="border border-border text-muted-foreground">
<p className="text-destructive">Error message</p>

// Bad Usage
<div style={{backgroundColor: '#ffffff'}}>
<button className="bg-red-500 text-white">
<div className="border-gray-200 text-slate-600">
```

### Available Tailwind Color Classes

**Basic:** `transparent`, `current`, `white`, `black`, `green`, `light`, `--yellow-light`

**Single colors:** `background`, `foreground`, `border`, `input`, `ring`

**With foreground variants:**

- `primary` / `primary-foreground`
- `secondary` / `secondary-foreground`
- `card` / `card-foreground`
- `popover` / `popover-foreground`
- `muted` / `muted-foreground`
- `accent` / `accent-foreground`
- `destructive` / `destructive-foreground`

Usage: `bg-primary`, `text-foreground`, `border-border`, etc.

### Available CSS Variables

For variables not defined in Tailwind, use `className="text-[var(--variable-name)]"` syntax:

**Basic:** `--radius`

**Page:** `--background`, `--foreground`

**Card:** `--card`, `--card-foreground`

**Popover:** `--popover`, `--popover-foreground`

**Primary:** `--primary`, `--primary-foreground`

**Secondary:** `--secondary`, `--secondary-foreground`

**Muted:** `--muted`, `--muted-foreground`

**Accent:** `--accent`, `--accent-foreground`

**Destructive:** `--destructive`, `--destructive-foreground`

**Border & Input:** `--border`, `--input`, `--ring`

**Chart:** `--chart-1`, `--chart-2`, `--chart-3`, `--chart-4`, `--chart-5`

**Sidebar:** `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring`

**Custom:** `--card-bg-light`, `--green`, `--yellow`, `--yellow-light`
