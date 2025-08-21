// 页面标题和描述
export const PAGE_TEXTS = {
	TOTAL_SOLANA: 'TOTAL SOLANA',
	WALLETS_HEADER: 'WALLETS',
	BALANCE_HEADER: 'BALANCE',
	TOKENS_HEADER: 'TOKENS',
	EQUIV_USD: '(equiv USD)',
} as const;

// 加载状态文本
export const LOADING_TEXT = {
	WALLETS: 'Loading wallets...',
	DESCRIPTION: 'Please wait while we fetch your wallet data',
} as const;

// 空状态文本
export const EMPTY_STATE = {
	NO_WALLETS: 'No wallets found',
	DESCRIPTION: 'Create your first wallet to get started',
} as const;

// 动态样式断点
export const BALANCE_TEXT_SIZE = {
	LARGE_THRESHOLD: 10,
	MEDIUM_THRESHOLD: 7,
	SMALL_CLASS: 'text-2xl',
	MEDIUM_CLASS: 'text-3xl',
	LARGE_CLASS: 'text-4xl',
} as const;

// 错误消息
export const ERROR_MESSAGES = {
	WALLET_NOT_FOUND: 'Wallet not found',
	INVALID_WALLET_ADDRESS: 'Invalid wallet address',
	SWITCH_WALLET_FAILED: 'Failed to switch wallet',
} as const;
