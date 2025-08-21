# Format Number Documentation

数字格式化工具函数，支持三种格式化模式：价格显示、紧凑显示和百分比显示。

## Type Definition

```typescript
type FormatNumberInput = number | string | null | undefined;
type FormatNumberType = 'price' | 'compact' | 'percent';
```

## API

### formatNumber(value, type?)

格式化数字显示

**参数:**

- `value: FormatNumberInput` - 要格式化的值
- `type?: FormatNumberType` - 格式化类型，默认为 'price'

**返回值:**

- `string` - 格式化后的字符串，异常情况返回 `'-'`

## Format Types

| 模式        | 说明                    | 示例输入     | 示例输出         |
| ----------- | ----------------------- | ------------ | ---------------- |
| **price**   | 千分位分隔符 + 下标显示 | `1234567.89` | `"1,234,567.89"` |
| **compact** | K/M/B/T 缩写格式        | `1234567`    | `"1.23M"`        |
| **percent** | 百分比格式（×100）      | `0.1569`     | `"15.69"`        |

## Usage Examples

### Price Mode (默认模式)

```typescript
import { formatNumber } from '@/utils/format-number';

// 基本千分位
formatNumber(1234567.89);
// 输出: "1,234,567.89"

// 下标显示（≥9位小数且连续≥3个0）
formatNumber(1.000222235);
// 输出: "1.0₃222235"

formatNumber(0.000123456);
// 输出: "0.0₃123456"

// 不触发下标的情况
formatNumber(1.2356645645665); // 不以0开头
// 输出: "1.2356645645665"

formatNumber(1.00265655665456); // 连续0<3个
// 输出: "1.00265655665456"
```

### Compact Mode

```typescript
// 基本缩写
formatNumber(1000, 'compact');
// 输出: "1K"

formatNumber(1500, 'compact');
// 输出: "1.5K"

formatNumber(1000222, 'compact');
// 输出: "1M"

formatNumber(1234567, 'compact');
// 输出: "1.23M"

// 大数值
formatNumber(1000000000, 'compact');
// 输出: "1B"

formatNumber(1000000000000, 'compact');
// 输出: "1T"
```

### Percent Mode

```typescript
// 基本百分比转换
formatNumber(0.15, 'percent');
// 输出: "15"

formatNumber(0.6685, 'percent');
// 输出: "66.85"

formatNumber(1.66689, 'percent');
// 输出: "166.68" (截断)

formatNumber(0.1234, 'percent');
// 输出: "12.34"
```

## Feature Details

### Price Mode Rules

| 条件                 | 行为             | 示例                           |
| -------------------- | ---------------- | ------------------------------ |
| 普通数字             | 添加千分位分隔符 | `1234` → `"1,234"`             |
| ≥9位小数 + 连续≥3个0 | 使用下标显示     | `1.000222235` → `"1.0₃222235"` |
| <9位小数             | 正常显示         | `1.00002222` → `"1.00002222"`  |
| 连续0<3个            | 正常显示         | `1.00265655` → `"1.00265655"`  |

### Compact Mode Rules

| 范围       | 单位   | 示例                               |
| ---------- | ------ | ---------------------------------- |
| ≥1T (万亿) | T      | `1234567890123` → `"1.23T"` (截断) |
| ≥1B (十亿) | B      | `1234567890` → `"1.23B"` (截断)    |
| ≥1M (百万) | M      | `1234567` → `"1.23M"` (截断)       |
| ≥1K (千)   | K      | `1234` → `"1.23K"` (截断)          |
| <1000      | 原数值 | `999` → `"999"`                    |

### Percent Mode Rules

| 步骤           | 操作         | 示例                |
| -------------- | ------------ | ------------------- |
| 1. 乘以100     | 转换为百分比 | `0.15` → `15`       |
| 2. 保留2位小数 | 截断         | `0.12345` → `12.34` |
| 3. 去除末尾零  | 清理格式     | `0.1000` → `10`     |

## Error Handling

| 输入类型             | 输出  | 日志                               |
| -------------------- | ----- | ---------------------------------- |
| `null` / `undefined` | `"-"` | 无                                 |
| 无效字符串           | `"-"` | `formatNumber: 无法转换为有效数字` |
| `NaN`                | `"-"` | `formatNumber: 无法转换为有效数字` |

## Technical Features

- ✅ **精度处理**: 使用 `big.js` 避免浮点数精度问题
- ✅ **性能优化**: 常量提取，减少重复计算
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **错误处理**: 全面的异常情况处理
