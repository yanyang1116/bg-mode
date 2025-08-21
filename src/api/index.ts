/**
 * API 统一入口文件
 */
import { retrieveLaunchParams } from '@telegram-apps/bridge';
import { isTMA } from '@telegram-apps/sdk-react';
import { toast } from 'sonner';
import store2 from 'store2';

import { USER_STORE_KEY } from '@/store/user/';

import {
	API_BASE_URL,
	BUSINESS_CODE,
	DEDUPLICATION_WINDOW,
	DEFAULT_CONFIG,
	ERROR_MESSAGES,
	HTTP_STATUS,
	NETWORK_ERROR_MESSAGE_TAG,
	REQUEST_TIMEOUT,
} from './const';
import {
	buildUrlWithParams,
	generateCacheKey,
	getInterceptorConfig,
	parseUserAgent,
} from './helper';
import type { DeduplicationCache, InterceptorOptions } from './types';

let lp: ReturnType<typeof retrieveLaunchParams>;
if (import.meta.env.DEV) {
	if (isTMA()) {
		lp = retrieveLaunchParams() as ReturnType<typeof retrieveLaunchParams>;
	} else {
		lp = JSON.parse(import.meta.env.VITE_MOCK_TG_LP);
	}
} else {
	lp = retrieveLaunchParams() as ReturnType<typeof retrieveLaunchParams>;
}

const applicationVersion = lp.tgWebAppVersion;
const languageCode = lp.tgWebAppData?.user?.languageCode;

const { sysVersion, brandModel } = parseUserAgent(window.navigator.userAgent);

const deviceInfo: Api.XDevice = {
	deviceType: lp.tgWebAppPlatform,
	deviceId: '',
	deviceName: '',
	sysVersion: sysVersion ?? '',
	sysLang: languageCode,
	brandModel: brandModel ?? '',
	timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	screenResolution: `${screen.width}x${screen.height}`,
	locationCity: '',
	firebaseToken: '',
	extraInfo: JSON.stringify({ pixelRatio: window.devicePixelRatio }),
};

// GET请求去重缓存
const pendingRequests = new Map<string, DeduplicationCache>();

/**
 * 清理过期的缓存
 */
const cleanExpiredCache = () => {
	const now = Date.now();
	for (const [key, cache] of pendingRequests.entries()) {
		if (now - cache.timestamp > DEDUPLICATION_WINDOW) {
			pendingRequests.delete(key);
		}
	}
};

/**
 * 执行实际的请求
 */
const executeRequest = async <T>(
	url: string,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<T>> => {
	// 创建AbortController用于超时控制
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

	// 发起 fetch 请求
	let response: Response;
	try {
		response = await fetch(url, {
			...options,
			signal: controller.signal,
			headers: {
				'Content-Type': DEFAULT_CONFIG.CONTENT_TYPE, // 默认 json ，定制 header 可覆盖
				// 业务必要参数
				'client-type': DEFAULT_CONFIG.CLIENT_TYPE,
				'auth-token': store2.get(USER_STORE_KEY)?.state?.token,
				'x-bid': DEFAULT_CONFIG.X_BID_VALUE, // TODO
				'x-device': JSON.stringify(deviceInfo),
				lang: languageCode ?? '',
				'version-code': applicationVersion,
				...options?.headers,
			},
			// credentials: options?.credentials ?? 'include', // 如果需要跨域携带 cookie，可以解开注释作为默认项
			// mode: options?.mode ?? 'cors', // 如果需要跨域，可以解开，作为默认项
		});
		clearTimeout(timeoutId);
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
		}
		throw new Error(NETWORK_ERROR_MESSAGE_TAG);
	}
	// HTTP 状态码检查
	if (!response.ok) {
		if (
			response.status === HTTP_STATUS.UNAUTHORIZED ||
			response.status === HTTP_STATUS.FORBIDDEN
		) {
			store2.remove(USER_STORE_KEY);
			window.location.reload();
			throw new Error(ERROR_MESSAGES.NO_PERMISSION); // 这个地方不需要做任何事情，直接 reload
		}

		// TODO 错误上报
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}

	// 解析响应体
	let result: Api.Response<T>;
	const contentType = response.headers.get('content-type');
	if (contentType?.includes(DEFAULT_CONFIG.CONTENT_TYPE)) {
		result = (await response.json()) as Api.Response<T>;
	} else {
		// TODO，其他情况都当作二进制数据处理，如果后面遇到了，需要解开处理，而且可能还要定制一下处理方式
		// result = await response.arrayBuffer();
		result = (await response.json()) as Api.Response<T>;
	}

	// 业务状态码检查
	if (result.code !== BUSINESS_CODE.SUCCESS) {
		throw new Error(result.error || ERROR_MESSAGES.UNKNOWN_ERROR);
	}

	return result.data;
};

/**
 * 核心拦截器函数
 */
export const request = async <T>(
	url: string,
	options?: InterceptorOptions,
): Promise<Base.DeepPartial<T>> => {
	const config = getInterceptorConfig(options);
	let fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

	// 处理 GET 请求的 params 参数
	const method = (options?.method || 'GET').toUpperCase();
	if (method === 'GET' && options?.params) {
		fullUrl = buildUrlWithParams(fullUrl, options.params);
	}

	const handleError = (error: Error) => {
		if (error.message === NETWORK_ERROR_MESSAGE_TAG) {
			// TODO，需要国际化，一定弹出来，网络错误，
			toast.error(ERROR_MESSAGES.NETWORK_ERROR);
			return;
		}
		if (config.toastEnabled) {
			// TODO: 需要国际化
			toast.error(error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR);
		}
	};

	try {
		// GET请求去重逻辑
		if (config.dedupEnabled) {
			cleanExpiredCache();
			const cacheKey = generateCacheKey(fullUrl, options);

			// 检查是否有相同请求在进行
			const cached = pendingRequests.get(cacheKey);
			if (cached && Date.now() - cached.timestamp < DEDUPLICATION_WINDOW) {
				return cached.promise;
			}
			// 发起新请求并缓存
			const promise = executeRequest<T>(fullUrl, options).catch((error) => {
				handleError(error);
				throw error;
			});
			pendingRequests.set(cacheKey, {
				promise,
				timestamp: Date.now(),
			});
			return promise;
		}

		// 非GET请求不需要去重
		return executeRequest<T>(fullUrl, options).catch((error) => {
			handleError(error);
			throw error;
		});
	} catch (error) {
		handleError(error as Error);
		throw error;
	}
};

// 导出所有模块
export * as userApi from './user/';

// 导出公共类型
export type * from './types';
