/**
 * API 相关常量定义
 */

// 基础 API 配置
export const API_BASE_URL = (import.meta.env.VITE_API_HOST || '') + import.meta.env.VITE_API_PREFIX;

// GET请求去重时间窗口（毫秒）
export const DEDUPLICATION_WINDOW = 300;

// 超时时间（毫秒）
export const REQUEST_TIMEOUT = 10000;

// 网络错误标记
export const NETWORK_ERROR_MESSAGE_TAG = 'Network Error';

// HTTP 状态码常量
export const HTTP_STATUS = {
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
} as const;

// 业务状态码常量
export const BUSINESS_CODE = {
	SUCCESS: 0,
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
	X_BID_VALUE: '1',
	CONTENT_TYPE: 'application/json',
	CLIENT_TYPE: 'TELEGRAM_WEBAPP',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
	NO_PERMISSION: 'No Permission',
	UNKNOWN_ERROR: 'Unknown Error',
	NETWORK_ERROR: 'Network Error',
} as const;
