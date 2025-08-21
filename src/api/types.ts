export interface InterceptorOptions extends RequestInit {
	/** GET请求去重，默认true */
	dedupGetRequest?: boolean;
	/** 错误弹窗，默认true */
	errorToast?: boolean;
	/** GET请求查询参数 */
	params?: Record<string, any>; // TODO，这里暂时用 any，遇到个问题，联合类型进一步约束的时候，只能用 type，不能用 interface
}

export interface DeduplicationCache {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	promise: Promise<any>; // 此处 any 是合适的
	timestamp: number;
}
