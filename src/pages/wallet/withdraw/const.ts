// ================================
// 提现页面常量配置
// ================================
export const WITHDRAW_CONSTANTS = {
	// 表单验证相关常量
	VALIDATION: {
		MIN_AMOUNT: 0,
		DECIMAL_PLACES: 18,
		// 正则表达式常量
		LEADING_ZEROS_PATTERN: /^0[0-9]/,
		LEADING_ZEROS_REPLACEMENT: /^0+/,
	} as const,

	// 错误提示文案
	ERRORS: {
		// 表单验证错误
		ADDRESS_REQUIRED: 'Address is required',
		INVALID_ADDRESS: 'Invalid Solana address',
		AMOUNT_REQUIRED: 'Amount is required',
		AMOUNT_GREATER_THAN_ZERO: 'Amount must be greater than 0',
		INSUFFICIENT_BALANCE: 'Insufficient balance',
		INVALID_AMOUNT: 'Invalid amount',

		// 网络和系统错误
		NETWORK_ERROR: 'Network connection failed. Please check your internet and try again.',
		TIMEOUT_ERROR: 'Request timeout. Please try again.',
		SERVER_ERROR: 'Server error. Please try again later.',
		UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
	} as const,

	// UI 界面文案
	UI: {
		// 按钮文案
		WITHDRAW: 'Withdraw',
		CANCEL: 'Cancel',
		CONFIRM: 'Confirm',
		MAX: 'MAX',
		WITHDRAWAL_HISTORY: 'View Withdrawal History',
		GO_BACK: '← Go Back',

		// 标签文案
		RECIPIENT_ADDRESS: 'Recipient Address',
		WITHDRAWAL_AMOUNT: 'Withdrawal Amount',
		TO_ADDRESS: 'To Address',
		AVAILABLE: 'Available',
		WITHDRAWAL: 'Withdrawal',
		WITHDRAWAL_SUCCESS: 'Withdrawal successful',
		// 占位符文案
		RECIPIENT_ADDRESS_PLACEHOLDER: 'Enter recipient wallet address',

		// 状态文案
		PROCESSING: 'Processing...',
		COMING_SOON: 'Coming soon!',
		CONFIRM_WITHDRAWAL: 'Confirm Withdrawal',

		// 错误页面文案
		ERROR_PAGE: {
			ICON: '😕',
			TITLE: 'Something went wrong',
			DESCRIPTION: 'Please go back to your wallet and try again',
		},
	} as const,
} as const;

// 为了向后兼容，保持旧的导出
export const FORM_VALIDATION = WITHDRAW_CONSTANTS.VALIDATION;
export const ERROR_MESSAGES = WITHDRAW_CONSTANTS.ERRORS;
export const UI_TEXT = WITHDRAW_CONSTANTS.UI;
