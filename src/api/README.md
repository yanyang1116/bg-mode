# API Interceptor Design Documentation

## Directory Structure

```
  src/api/
  ├── index.ts                    # 入口及拦截器
  ├── const.ts                    # 业务常量定义
  ├── helper.ts                   # 工具函数
  ├── types.ts                    # 通用类型定义
  └── user/                       # 按照控制器划分
      ├── index.ts                # 导出入口
      ├── api.ts                  # API 函数定义
      ├── request.d.ts            # 请求类型定义
      ├── response.d.ts           # 响应类型定义
      └── types.ts                # 业务类型定义
```

## Design Features

### 1. Native fetch-based with complete interface passthrough

### 2. GET request deduplication with 300ms window

可以通过配置项关闭，但是一般不需要关。

### 3. Extended with three parameters

在原生 `fetch` 基础上，增加了三个参数：

```typescript
interface InterceptorOptions extends RequestInit {
	/** GET请求去重，默认true */
	dedupGetRequest?: boolean;
	/** 错误弹窗，默认true */
	errorToast?: boolean;
	/** GET请求查询参数 */
	params?: Record<string, any>;
}
```

### 4. Backend agreement compliance for response handling

严格遵循与后端的约定，实现完整的错误处理链路：

- HTTP 状态码检查：200 ✓
- 业务状态码检查：code === 0 ✓
- 错误信息提取：error → errorParams
- 最终数据解析：resolve(data)

### 5. Complete type inference

所有 API 调用都支持类型推导，前端**需要**手撮接口类型：

**文件组织方式：**

- `request.d.ts` - 请求类型定义
- `response.d.ts` - 响应类型定义
- `types.ts` - 业务相关类型定义

**导出方式：**

```typescript
// 使用示例
import { Request, Response } from '@/api/user';

// index.ts
export * from './api';
export * as Request from './request.d';
export * as Response from './response.d';
export * from './types';

type LoginReq = Request.LoginRequest;
type LoginRes = Response.LoginResponse;
```

### 6. Optional chaining protection

所有数据，都有非空保护，自动推导可选链
![推导的例子](https://raw.githubusercontent.com/yanyang1116/file/refs/heads/master/asdfqwerqwerqwer.png)

```typescript
// 自动推导为可选类型，需要使用可选链
walletData?.totalBalanceInSOL;
walletData?.wallets?.[0]?.address;
```
