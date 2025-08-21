# Meme TG Mini App

## 项目概述

基于 `tg-mini-app-cli` 生成的 Telegram 小程序项目，已移除不必要的脚本并优化了相关配置项。

## 目录结构

仅列出需要特别说明的文件，**需要持续维护更新**。

```
meme-tg-miniapp/
├── .cursor/                    # Cursor AI 规则配置目录
├── assets/
├── public/
|
├── src/
│   ├── api/
│   ├── components/
│   │   ├── layout/             # 布局相关组件
│   │   ├── shadcn-ui/          # shadcn/ui 组件库
│   │   ├── ...
│   │   ├── ErrorBoundary.tsx   # 错误边界组件 (tg 默认生成)
│   │   ├── EnvUnsupported.tsx  # 环境不支持提示组件(tg 默认生成)
│   │   ├── Page.tsx
│   │   └── Root.tsx
|   |
│   ├── ...
|   |
│   ├── pages/
|   |
│   ├── global.d.ts             # 全局类型声明，高频使用的提取出来，用 namespace 模块化
|   |
│   └── theme.css
|
├── CLAUDE.md                   # Claude AI 规则文档，给 Claude Code 用
|
├── components.json             # shadcn/ui 组件配置
|
├── module.d.ts                 # 遇到没有类型声明的第三方包，可以声明在这里
|
├── ...                         # 其他文件
|
└── README.md
```

## 依赖包说明

仅列出需要特别说明的依赖包，**需要持续维护更新**。

```json
{
	"dependencies": {
		// ... 其他依赖
		"@solana/web3.js": "^1.98.2", // Solana 区块链 Web3 库
		"@telegram-apps/sdk": "^3.11.4", // 有些场景需要调用 tg 原生 SDK
		"@telegram-apps/sdk-react": "^3.3.1", // Telegram 小程序 React SDK
		"@telegram-apps/telegram-ui": "^2.1.8", // 默认生成的，暂时还删不了，后期慢慢要删掉这个
		"ahooks": "^3.9.0", // 用这个吧，主要考虑这个认知成本最小
		"big.js": "^6.2.2",
		"bs58": "^6.0.0",
		"copy-to-clipboard": "^3.3.3",
		"dayjs": "^1.11.13",
		"eruda": "^3.4.1", // 移动端调试工具，需了解 Telegram Mini App 调试规范
		"lodash-es": "^4.17.21",
		"lucide-react": "^0.525.0", // 图标库
		"store2": "^2.14.4", // 本地存储工具

		"use-immer": "^0.11.0", // 不可变数据，提高应用性能
		"zustand": "^5.0.6",
		"@use-gesture/react": "^10.3.1", // 手势库

		// shadui 添加的，可以用起来
		"react-hook-form": "^7.62.0",
		"next-themes": "^0.4.6",
		"framer-motion": "^12.23.12", // 动画库
		"tailwind-merge": "^3.3.1",
		"vaul": "^1.1.2",
		"zod": "^4.0.17",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		// 其他 "@radix-ui" 相关
		"@hookform/resolvers": "^5.2.1"
	},
	"devDependencies": {
		// ...
		"@nxlibs/eslint-config": "^1.0.3", // ESLint 配置，后期专门给 jumpex 建一个仓库，来发布
		"@nxlibs/prettier-config": "^1.0.2",
		"@nxlibs/typescript-config": "^1.1.0",

		"@vitejs/plugin-react-swc": "^3.8.1", // Vite SWC 插件，提升构建性能
		"gh-pages": "^6.1.1", // GitHub Pages 部署工具，后续 CI/CD 完善后可移除
		"sass-embedded": "^1.89.2", // Sass 预处理器，Vite 配置为 modern 模式时必需
		"tw-animate-css": "^1.3.6", // shadcn 默认依赖，否则跑不起来
		"vite-plugin-mkcert": "^1.17.8"
	}
}
```

## AI 开发规范

### Cursor Rules 目录结构

```
.cursor/
├── rules/
│   ├── react.mdc
│   ├── team-extra.mdc     # 团队额外规则（新增规则请添加至此）
│   ├── development.mdc
│   ├── tailwind.mdc
│   └── typescript.mdc
└── .DS_Store
```

### 规则文件说明

#### team-extra.mdc

当发现个人开发习惯或 AI 行为不符合预期，且不适合归类到现有规则文件时，请添加至此文件。

#### claude.md 与 cursor 同步

在 `.cursor/rules` 中添加规则后，请同步到 `claude.md` 给 `Claude Code` 参考，可让 AI 协助同步。

#### Token 优化策略

当前所有 cursor rules 均设置为 `always`，每次对话都会携带：

- 推荐保持此设置，如 token 消耗过高可后续调整
- 已进行精简优化，后续添加规则时请让 AI 协助精简，减少 token 消耗

## 日期与数字格式化

> 看了一下，还是需要参考竞品定制一下 UI Spec，以免后续混乱。

### 数字

数字格式化工具支持三种模式：价格显示、紧凑显示和百分比显示。

1. **Price 模式（默认）**：千分位分隔符 + 下标显示
    - 例如：`1234567.89` → `"1,234,567.89"`
    - 当小数位数≥9位且连续≥3个0时，使用下标显示：`1.000222235` → `"1.0₃222235"`

2. **Compact 模式**：K/M/B/T 缩写格式
    - 例如：`1234567` → `"1.23M"`

3. **Percent 模式**：百分比格式（×100）
    - 例如：`0.1569` → `"15.69"`

4. **异常处理**：对于空数值和错误情况统一处理为 `-`
    - 支持 `number | string | null | undefined` 输入
    - 使用 `big.js` 避免浮点数精度问题

```typescript
import { formatNumber } from '@/utils/format-number';

formatNumber(1234567.89); // "1,234,567.89"
formatNumber(1234567, 'compact'); // "1.23M"
formatNumber(0.1569, 'percent'); // "15.69"
```

详情参考：[Format Number 文档](./src/utils/format-number/README.md)

### 日期

日期格式化工具基于 `dayjs` 实现，提供简洁易用的日期显示。

1. **默认格式**：`MM/DD HH:mm:ss`，避免每次都重写 `dayjs` 默认的 `YYYY-MM-DDTHH:mm:ssZ` 格式
    - 例如：`formatDate(new Date())` → `"08/11 14:30:45"`

2. **灵活配置**：支持自定义格式，完全透传 `dayjs` 参数
    - 支持 `Date | string | number | dayjs | null | undefined` 输入
    - 可传入任意 `dayjs` 支持的格式字符串

3. **常用格式示例**：
    - `formatDate(new Date(), 'YYYY-MM-DD')` → `"2025-08-11"`
    - `formatDate(new Date(), 'YYYY年MM月DD日')` → `"2025年08月11日"`

4. **异常处理**：错误或空值统一处理为 `-`
    - 不会抛出异常，无效输入会输出错误日志并返回 `-`

5. **时区处理**：
    - 会自动带上本地时区格式化

```typescript
import { formatDate } from '@/utils/format-date';

formatDate(new Date()); // "08/11 14:30:45"
formatDate(Date.now(), 'YYYY-MM-DD'); // "2025-08-11"
formatDate('invalid-date'); // "-"
```

详情参考：[Format Date 文档](./src/utils/format-date/README.md)

> **注意**：后期这两个工具包会提取成公共包进行发布，目前先在本地调用使用。

## 主题与色彩规范

> 根据实际使用反馈可进行调整。主要目的是避免色彩使用混乱，确保项目视觉一致性。

### 基于 shadcn/ui 主题系统

项目样式和主题完全基于 `shadcn/ui`，使用其定义的**变量系统**，并**覆盖**了 Tailwind 的默认色彩配置。

#### 禁止直接使用色值

在代码中**禁止**直接使用十六进制色值或 `rgb` 值，应使用预定义的主题变量，确保色彩系统一致性。

可用色彩变量（shadcn/ui 默认，未扩展）：

```css
/* 基础设置 */
--radius: 0.65rem; /* 圆角半径 */

/* 页面基础颜色 */
--background: oklch(1 0 0); /* 页面背景色 - 纯白 */
--foreground: oklch(0.141 0.005 285.823); /* 主要文字颜色 - 深蓝灰 */

/* 卡片颜色 */
--card: oklch(1 0 0); /* 卡片背景色 - 纯白 */
--card-foreground: oklch(0.141 0.005 285.823); /* 卡片文字颜色 - 深蓝灰 */

/* 弹出层颜色 */
--popover: oklch(1 0 0); /* 弹出层背景色 - 纯白 */
--popover-foreground: oklch(0.141 0.005 285.823); /* 弹出层文字颜色 - 深蓝灰 */

/* 主色调 */
--primary: oklch(0.606 0.25 292.717); /* 主色调 - 紫色 */
--primary-foreground: oklch(0.969 0.016 293.756); /* 主色调文字 - 淡紫 */

/* 次要色调 */
--secondary: oklch(0.967 0.001 286.375); /* 次要色调 - 极浅灰 */
--secondary-foreground: oklch(0.21 0.006 285.885); /* 次要色调文字 - 深蓝灰 */

/* 静音色调 */
--muted: oklch(0.967 0.001 286.375); /* 静音色调 - 极浅灰 */
--muted-foreground: oklch(0.552 0.016 285.938); /* 静音色调文字 - 中灰 */

/* 强调色 */
--accent: oklch(0.967 0.001 286.375); /* 强调色 - 极浅灰 */
--accent-foreground: oklch(0.21 0.006 285.885); /* 强调色文字 - 深蓝灰 */

/* 危险色 */
--destructive: oklch(0.577 0.245 27.325); /* 危险/删除按钮 - 红色 */

/* 边框和输入框 */
--border: oklch(0.92 0.004 286.32); /* 边框颜色 - 浅灰 */
--input: oklch(0.92 0.004 286.32); /* 输入框背景 - 浅灰 */
--ring: oklch(0.606 0.25 292.717); /* 聚焦环颜色 - 紫色 */

/* 图表颜色 */
--chart-1: oklch(0.646 0.222 41.116); /* 图表色彩1 - 橙黄色 */
--chart-2: oklch(0.6 0.118 184.704); /* 图表色彩2 - 青蓝色 */
--chart-3: oklch(0.398 0.07 227.392); /* 图表色彩3 - 深蓝色 */
--chart-4: oklch(0.828 0.189 84.429); /* 图表色彩4 - 绿色 */
--chart-5: oklch(0.769 0.188 70.08); /* 图表色彩5 - 黄绿色 */

/* 侧边栏颜色 */
--sidebar: oklch(0.985 0 0); /* 侧边栏背景 - 极浅灰 */
--sidebar-foreground: oklch(0.141 0.005 285.823); /* 侧边栏文字 - 深蓝灰 */
--sidebar-primary: oklch(0.606 0.25 292.717); /* 侧边栏主色调 - 紫色 */
--sidebar-primary-foreground: oklch(0.969 0.016 293.756); /* 侧边栏主色调文字 - 淡紫 */
--sidebar-accent: oklch(0.967 0.001 286.375); /* 侧边栏强调色 - 极浅灰 */
--sidebar-accent-foreground: oklch(0.21 0.006 285.885); /* 侧边栏强调色文字 - 深蓝灰 */
--sidebar-border: oklch(0.92 0.004 286.32); /* 侧边栏边框 - 浅灰 */
--sidebar-ring: oklch(0.606 0.25 292.717); /* 侧边栏聚焦环 - 紫色 */

/* 下放可以自定义拓展，不要忘了 dark 里，也需要一份对应 dark 模式 ↓↓↓ */

--green: oklch(0.646 0.132 142.495); /* 绿色 */
--card-bg-light: #2a3441;
--yellow-light: #fef3c7;
--yellow: #f59e0b;
```

使用示例：

```jsx
<p className="text-[var(--destructive)]">Hello</p>
```

#### Tailwind 色彩覆写

为避免与 Tailwind 内置色彩系统冲突，已完全移除 Tailwind 默认色彩系统，仅保留必要色彩并接入 shadcn/ui 色彩。

使用示例：

```jsx
<p className="text-destructive">Hello</p>
```

配置 `Tailwind CSS IntelliSense` VSCode 插件后，可在编码时获得快速提示：
![VSCode 插件示例](https://raw.githubusercontent.com/yanyang1116/file/refs/heads/master/tasdfqwerqwerdfg.png)

#### 色彩扩展

当现有色彩不够用时，参考 [shadcn/ui 官方文档](https://ui.shadcn.com/docs/theming) 添加新的色彩变量。

**如高频使用，可进一步添加到 Tailwind 色彩配置中。**

### 其他样式配置

#### 圆角定制

使用 shadcn/ui 的圆角配置，替换 Tailwind 默认圆角数值。

```jsx
// 使用预定义的圆角尺寸
<div className="rounded-sm">    // calc(var(--radius) - 4px)
<div className="rounded-md">    // calc(var(--radius) - 2px)
<div className="rounded-lg">    // var(--radius)
<div className="rounded-xl">    // calc(var(--radius) + 4px)
```

### shadcn components 配置

配置文件已调整别名，其他配置基本保持原样。后续修改如有副作用，同步到团队。
另外，安装 `shadui` 的时候，可能会安装别的包，可以同步到团队，有使用场景的话也可以用起来，

## 浏览器兼容性

由于 Telegram 小程序**无需**考虑兼容性（CLI 生成时的约定），当前移除所有 `postcss`、`polyfill` 相关配置，`tsc` 编译目标设置为最新版本（`esnext`）。

## 待办事项

- [ ] 构建优化
- [ ] 部署、发布流程
- [ ] 处理项目中的其他 TODO 项
- [ ] WebSocket 订阅器
