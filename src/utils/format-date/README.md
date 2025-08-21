# format-date 函数文档

日期格式化工具函数，基于 dayjs 实现，支持 UTC 时区自动转换。

## API

### formatDate(input, format?)

格式化日期显示，自动处理后端 UTC 时间转换为本地时区

**参数:**

- `input: ConfigType` - dayjs 支持的输入类型 (Date | string | number | dayjs | null | undefined)
- `format?: string` - 格式字符串，默认为 `'MM/DD HH:mm:ss'`

**返回值:**

- `string` - 格式化后的日期字符串，转换为本地时区，无效输入返回 `'-'`

**时区处理:**

- **ISO 字符串**（包含 'T'）：假设为 UTC 时间，自动转换为本地时区
- **其他格式**：时间戳、Date 对象等直接使用本地时区

## 使用示例

### 基本用法

```typescript
import { formatDate } from '@/utils/format-date';

// 默认格式 (MM/DD HH:mm:ss)
formatDate(new Date());
// 输出: "08/11 14:30:45"

formatDate(Date.now());
// 输出: "08/11 14:30:45"

// 后端 UTC 时间自动转换（包含 'T' 的 ISO 格式）
formatDate('2025-08-11T12:30:45Z');
// 输出: "08/11 20:30:45" (假设本地为 UTC+8)

formatDate('2025-08-11T12:30:45.000Z');
// 输出: "08/11 20:30:45" (假设本地为 UTC+8)

// 本地时间格式（不含 'T'）
formatDate('2025-08-11 12:30:45');
// 输出: "08/11 12:30:45"

// 异常值处理
formatDate('invalid-date'); // 输出: "-"
formatDate(null); // 输出: "-"
```

### 自定义格式

```typescript
// 常用格式
formatDate(new Date(), 'YYYY-MM-DD');
// 输出: "2025-08-11"

formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
// 输出: "2025-08-11 14:30:45"

formatDate(new Date(), 'YYYY/MM/DD');
// 输出: "2025/08/11"

formatDate(new Date(), 'HH:mm:ss');
// 输出: "14:30:45"

// 中文格式
formatDate(new Date(), 'YYYY年MM月DD日');
// 输出: "2025年08月11日"

formatDate(new Date(), 'MM月DD日 HH:mm');
// 输出: "08月11日 14:30"

// 后端 UTC 时间的格式化示例
formatDate('2025-08-11T06:30:45Z', 'YYYY-MM-DD HH:mm:ss');
// 输出: "2025-08-11 14:30:45" (假设本地为 UTC+8)
```

## 支持的输入类型

基于 dayjs 的 `ConfigType`，支持所有 dayjs 输入：

- **Date 对象**: `new Date()` - 直接使用本地时区
- **时间戳**: `Date.now()` 或 `1634567890000` - 直接使用本地时区
- **ISO 字符串**: `'2025-08-11T12:30:45Z'` - **自动从 UTC 转换为本地时区**
- **普通字符串**: `'2025-08-11'`、`'2025-08-11 12:30:45'` - 直接使用本地时区
- **dayjs 对象**: `dayjs()` - 保持原有时区
- **null/undefined**: `null` 返回 `'-'`，`undefined` 返回当前时间

## 格式字符串

支持所有 dayjs 格式令牌：

| 令牌   | 输出   | 说明          |
| ------ | ------ | ------------- |
| `YYYY` | 2025   | 4位年份       |
| `YY`   | 25     | 2位年份       |
| `MM`   | 08     | 月份（01-12） |
| `DD`   | 11     | 日期（01-31） |
| `HH`   | 14     | 小时（00-23） |
| `mm`   | 30     | 分钟（00-59） |
| `ss`   | 45     | 秒（00-59）   |
| `A`    | AM/PM  | 上午/下午     |
| `dddd` | Monday | 星期几全称    |

更多格式令牌请参考 [dayjs 文档](https://day.js.org/docs/en/display/format)。

## 异常处理

函数会自动处理异常情况并输出错误日志：

```typescript
formatDate('invalid'); // console.error: "formatDate: 无法解析日期 invalid"
formatDate({}); // console.error: "formatDate: 无法解析日期 [object Object]"
```

## 特性说明

1. **智能时区转换** - 自动检测 UTC 时间并转换为本地时区
2. **不会抛出异常** - 无效输入统一返回 `'-'`
3. **后端友好** - 专为处理后端 UTC 时间设计
4. **类型安全** - 完整的 TypeScript 类型支持
5. **轻量简洁** - 基于 dayjs，包体积小
6. **格式灵活** - 支持所有 dayjs 格式字符串

## UTC 时区转换逻辑

函数会根据输入类型自动处理时区：

```typescript
// 这些格式会被识别为 UTC 时间并转换
formatDate('2025-08-11T12:30:45Z'); // ISO with Z
formatDate('2025-08-11T12:30:45.000Z'); // ISO with milliseconds
formatDate('2025-08-11T12:30:45+00:00'); // ISO with timezone

// 这些格式保持本地时区
formatDate('2025-08-11 12:30:45'); // 普通字符串
formatDate('2025-08-11'); // 日期字符串
formatDate(1634567890000); // 时间戳
formatDate(new Date()); // Date 对象
```
