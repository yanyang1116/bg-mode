# truncateText

截断过长的文本字符串工具，用于UI显示各类文本内容。

## 使用方法

```typescript
import { truncateText } from '@/utils/truncate-text';

// 基础使用（默认20个字符）
truncateText('This is a very long text that needs to be truncated');
// 输出: { truncated: "This is ...cated", isTruncated: true, original: "This is a very long text that needs to be truncated" }

// 自定义长度
truncateText('Hello World', 8);
// 输出: { truncated: "Hel...rld", isTruncated: true, original: "Hello World" }

// 短文本直接返回
truncateText('Short', 20);
// 输出: { truncated: "Short", isTruncated: false, original: "Short" }

// 空值处理
truncateText(null);
// 输出: { truncated: "-", isTruncated: false, original: "-" }

truncateText('   ');
// 输出: { truncated: "-", isTruncated: false, original: "-" }
```

## 参数

- `text` (TextInput): 要截断的文本内容，支持多种类型
- `maxLength` (number, 可选): 允许的最大字符长度，默认为 20，必须为正整数

## 返回值

返回一个对象，包含：

- `truncated` (string): 截断后的字符串
- `isTruncated` (boolean): 是否被截断
- `original` (string): 处理后的原始字符串

## 支持的输入类型

函数支持多种输入类型的自动转换：

```typescript
// 字符串
truncateText('Hello World');

// 数字
truncateText(12345);
// 输出: { truncated: "12345", isTruncated: false, original: "12345" }

// 布尔值
truncateText(true);
// 输出: { truncated: "true", isTruncated: false, original: "true" }

// 对象（自动JSON化）
truncateText({ name: 'John', age: 30 });
// 输出: { truncated: '{"name":"John","age":30}', isTruncated: false, original: '{"name":"John","age":30}' }

// 空值
truncateText(null); // 输出: "-"
truncateText(undefined); // 输出: "-"
```

## 特殊字符保护

函数具备emoji和特殊字符的安全截断功能：

```typescript
// 普通文本
truncateText('hello world', 8);
// 输出: { truncated: "hel...rld", isTruncated: true, original: "hello world" }

// 包含emoji的文本 - 不会截断emoji
truncateText('hello 😀 world', 8);
// 输出: { truncated: "hel...rld", isTruncated: true, original: "hello 😀 world" }

// emoji序列
truncateText('🎉🎊🎈🎁', 6);
// 输出: { truncated: "🎉🎊...🎁", isTruncated: true, original: "🎉🎊🎈🎁" }
```

## 使用场景

- **用户名截断**：显示长用户名
- **地址显示**：钱包地址、邮箱地址等
- **描述文本**：商品描述、用户简介等
- **文件名**：长文件名的显示
- **通用文本截断**：任何需要限制显示长度的文本内容

## 错误处理

函数会在以下情况抛出错误：

- `maxLength` 不是正整数时，抛出 `Error: maxLength must be a positive integer`

```typescript
// 错误示例
truncateText('text', 0); // Error: maxLength must be a positive integer
truncateText('text', -1); // Error: maxLength must be a positive integer
truncateText('text', 1.5); // Error: maxLength must be a positive integer
```

## 截断策略

- **长度足够（≥5）**：使用 `前部分...后部分` 格式
- **长度较小（<5）**：直接截取前N个字符
- **特殊字符保护**：避免在emoji或Unicode代理对中间截断

## 示例对比

| 输入               | maxLength | 输出结果      | isTruncated |
| ------------------ | --------- | ------------- | ----------- |
| `"Hello"`          | 20        | `"Hello"`     | false       |
| `"Hello World"`    | 8         | `"Hel...rld"` | true        |
| `"Hi"`             | 3         | `"Hi"`        | false       |
| `"Hello"`          | 2         | `"He"`        | true        |
| `"Hello 😀 World"` | 8         | `"Hel...rld"` | true        |
| `null`             | 20        | `"-"`         | false       |
| `true`             | 20        | `"true"`      | false       |
