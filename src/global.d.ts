/**
 * @file
 * 全局类型声明
 * 注意必要性
 *
 * 这个文件，不能 import、export 任何东西，不然会变成私有模块，可以用 /// 来处理
 */

declare namespace Base {
	export type Theme = 'light' | 'dark';
	export type Nullable<T> = T | null | undefined;

	/**
	 * 深度递归可选类型
	 * 目前只处理 映射、数组、其他类型
	 * 最后都会落到 Nullable<T> 上，这个是合理的，不需要额外考虑了
	 */
	type DeepPartial<T> = T extends (infer U)[]
	? Nullable<DeepPartial<U>[]>
	: T extends Record<string, any> // any 也是合理的
	? Nullable<{ [P in keyof T]?: Nullable<DeepPartial<T[P]>>
}>
	: Nullable<T>;
}

declare namespace Api {
	export type Response<T> = {
		/** 0 成功，非 0 失败 */
		code: number;

		/** 错误参数，主要是国际化的时候，一些可选配置项需要暴露出来，不然不太好进行翻译 */
		errorParams?: unknown;

		/** 错误信息，暂时可以不处理，目前从后端设计来看，是 i18n 的 json 索引字符串 */
		error?: string;

		/** payload - 服务端可能不返回或返回不完整的数据，使用递归可选类型保护 */
		data: Base.DeepPartial<T>;
	};

	/** 分页器返回 */
	export type PaginationResponse<Item> = {
		total: number;
		rows: Item[];
	};

	/** 分页器请求 */
	export interface PaginationRequest {
		pageIndex?: number;
		pageSize?: number;
	};


	/** 设备信息 */
	export interface XDevice {
		deviceType?: string,
		deviceId?: string,
		deviceName?: string,
		sysVersion?: string,
		sysLang?: string,
		brandModel?: string,
		timeZone?: string,
		screenResolution?: string,
		locationCity?: string,
		firebaseToken?: string,
		extraInfo?: string
	}

	/** X Bid */
	export type XBid = unknown;
}

declare namespace Wallet {
	export interface TokenItem {
		name: string;
		address: string;
		imageUrl: string;
		balanceInSOL: string;
		balanceInUSDC: string;
		priceInUSDC: string;
		amount: string;
	}

	export interface WalletItem {
		address: string;
		primary: boolean;
		name: string;
		totalBalanceInSOL: string;
		totalBalanceInUSDC: string;
		tokenBalanceInSOL: string;
		tokenBalanceInUSDC: string;
		tokens: TokenItem[];
	}
}


declare global {
	interface Window {
		TradingView: TradingView.IChartingLibraryWidget;
	}
}
