/**
 * API 工具函数
 */
import type { InterceptorOptions } from './types';

/**
 * 生成去重缓存键
 */
export const generateCacheKey = (url: string, options?: InterceptorOptions): string => {
	const method = (options?.method || 'GET').toUpperCase();
	const headers = JSON.stringify(options?.headers || {});
	const body = options?.body ? JSON.stringify(options.body) : '';
	return `${method}:${url}:${headers}:${body}`;
};

/**
 * 构建带查询参数的URL
 */
export const buildUrlWithParams = (
	url: string,
	params?: Record<string, string | number | boolean | null | undefined>,
): string => {
	if (!params || Object.keys(params).length === 0) {
		return url;
	}

	const urlObj = new URL(url);
	Object.entries(params).forEach(([key, value]) => {
		// 过滤 null 和 undefined
		if (value !== null && value !== undefined) {
			urlObj.searchParams.set(key, String(value));
		}
	});

	return urlObj.toString();
};

/**
 * 获取拦截器配置
 */
export const getInterceptorConfig = (options?: InterceptorOptions) => {
	const method = (options?.method || 'GET').toUpperCase();

	return {
		// GET请求去重：只对GET生效，默认启用
		dedupEnabled: method === 'GET' && options?.dedupGetRequest !== false,

		// 错误弹窗：所有请求都可用，默认启用
		toastEnabled: options?.errorToast !== false,
	};
};

export const parseUserAgent = (ua: string) => {
	let sysVersion = null;
	let brandModel = null;

	// 提取系统版本
	if (ua.includes('iPhone')) {
		// iOS: CPU iPhone OS 16_6
		const iosMatch = ua.match(/CPU iPhone OS (\d+)_(\d+)(?:_(\d+))?/);
		if (iosMatch) {
			sysVersion = iosMatch[1] + '.' + iosMatch[2];
			if (iosMatch[3]) sysVersion += '.' + iosMatch[3];
		}
		brandModel = 'iPhone';
	} else if (ua.includes('Android')) {
		// Android: Android 11.0 或 Android 8.0.0
		const androidMatch = ua.match(/Android ([\d.]+)/);
		if (androidMatch) {
			sysVersion = androidMatch[1];
		}

		// 提取设备型号 (Android 版本后的设备信息)
		const deviceMatch = ua.match(/Android [\d.]+;\s*([^)]+)/);
		if (deviceMatch) {
			brandModel = deviceMatch[1]?.trim();
		}
	}

	return {
		sysVersion,
		brandModel,
	};
};
