// 地址显示长度
export const ADDRESS_DISPLAY_LENGTH = 20;

// 钱包名称显示长度阈值
export const WALLET_NAME_MAX_DISPLAY_LENGTH = 20;

// 加载状态文本
export const LOADING_TEXT = {
	TOKENS: 'Loading tokens...',
	DESCRIPTION: 'Please wait while we fetch your token data',
} as const;

// 空状态文本
export const EMPTY_STATE = {
	NO_TOKENS: 'No tokens found',
	DESCRIPTION: "Your wallet doesn't have any tokens yet",
} as const;
