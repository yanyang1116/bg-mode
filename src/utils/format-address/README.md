# format-address

格式化地址工具，用于省略过长的地址字符串。

## 使用方法

```typescript
import { formatAddress } from '@/utils/format-address';

// 基础使用（默认保留12个字符）
formatAddress('6Zc8PYnRVLR8K3mNBJKjqv2NfQQxhU7M9rYpGzVxoEtT');
// 输出: "6Zc8PY...xoEtT"

// 自定义长度
formatAddress('6Zc8PYnRVLR8K3mNBJKjqv2NfQQxhU7M9rYpGzVxoEtT', 16);
// 输出: "6Zc8PYnR...zVxoEtT"

// 地址较短时直接返回
formatAddress('abc123', 12);
// 输出: "abc123"

// 空地址处理
formatAddress('', 12);
// 输出: ""
```

## 参数

- `address` (string): 需要格式化的地址字符串，必须为字符串类型
- `totalLength` (number, 可选): 保留的总字符数，默认为 12。不包括省略号的长度，必须为正整数

## 返回值

返回格式化后的地址字符串，格式为 `前半部分...后半部分`。

## 错误处理

函数会在以下情况抛出错误：

- `address` 参数不是字符串类型时，抛出 `Error: Address must be a string`
- `totalLength` 参数不是正整数时，抛出 `Error: Total length must be a positive integer`

```typescript
// 错误示例
formatAddress(null, 12); // Error: Address must be a string
formatAddress('abc', 0); // Error: Total length must be a positive integer
formatAddress('abc', -5); // Error: Total length must be a positive integer
formatAddress('abc', 1.5); // Error: Total length must be a positive integer
```

## 示例

| 输入地址                                       | totalLength | 输出结果             |
| ---------------------------------------------- | ----------- | -------------------- |
| `6Zc8PYnRVLR8K3mNBJKjqv2NfQQxhU7M9rYpGzVxoEtT` | 12          | `6Zc8PY...xoEtT`     |
| `6Zc8PYnRVLR8K3mNBJKjqv2NfQQxhU7M9rYpGzVxoEtT` | 16          | `6Zc8PYnR...zVxoEtT` |
| `6Zc8PYnRVLR8K3mNBJKjqv2NfQQxhU7M9rYpGzVxoEtT` | 8           | `6Zc8...oEtT`        |
