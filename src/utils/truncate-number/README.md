# truncateNumber

截断过长的数字字符串工具，用于详情页面显示超长数值。

## 使用方法

```typescript
import { formatNumber } from '@/utils/format-number';
import { truncateNumber } from '@/utils/truncate-number';

// 基础使用：先formatNumber格式化，再truncateNumber截断
const formattedPrice = formatNumber(1234567890.12, 'price'); // "1,234,567,890.12"
const result = truncateNumber(formattedPrice);
// 输出: { truncated: "1,234,567,890.12", isTruncated: false, original: "1,234,567,890.12" }

// 超长格式化数字会被截断
const longPrice = formatNumber(987654321098765.43, 'price'); // "987,654,321,098,765.43"
const result2 = truncateNumber(longPrice, 12);
// 输出: { truncated: "987,6...65.43", isTruncated: true, original: "987,654,321,098,765.43" }

// 短数字直接返回
const shortPrice = formatNumber(123.45, 'price'); // "123.45"
const result3 = truncateNumber(shortPrice);
// 输出: { truncated: "123.45", isTruncated: false, original: "123.45" }
```

## 参数

- `formattedString` (string): 已格式化的数字字符串（通常来自formatNumber）
- `maxLength` (number, 可选): 允许的最大字符长度，默认为 15

## 返回值

返回一个对象，包含：

- `truncated` (string): 截断后的字符串
- `isTruncated` (boolean): 是否被截断
- `original` (string): 原始完整字符串

## 使用场景

适用于详情页面需要显示完整数字，但UI空间有限的情况。通常配合 Popover 组件使用，点击截断的数字显示完整值。

**推荐工作流程**：

1. 使用 `formatNumber` 格式化原始数字（添加千分位逗号等）
2. 使用 `truncateNumber` 处理可能过长的格式化字符串
3. 配合 Popover 显示完整数字

## 示例

| 格式化输入                 | maxLength | 输出结果             | isTruncated |
| -------------------------- | --------- | -------------------- | ----------- |
| `"123.45"`                 | 15        | `"123.45"`           | false       |
| `"1,234,567,890.12"`       | 15        | `"1,234,567,890.12"` | false       |
| `"987,654,321,098,765.43"` | 15        | `"987,65...65.43"`   | true        |
