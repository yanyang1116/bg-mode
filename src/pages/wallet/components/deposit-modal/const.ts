// 充值弹窗相关常量
export const DEPOSIT_MODAL = {
	TITLE: 'Deposit',
	SUBTITLE: 'Send tokens to this address',
	COPY_SUCCESS: 'Address copied to clipboard',
	COPY_ERROR: 'Failed to copy address',
	CLOSE_LABEL: 'Close deposit modal',
	COPY_LABEL: 'Copy wallet address',
} as const;

export const ADDRESS_DISPLAY = {
	MOBILE_LENGTH: 12,
	DESKTOP_LENGTH: 16,
} as const;

export const QR_CODE = {
	SIZE: 120,
	MARGIN: 1,
	ERROR_CORRECTION: 'M' as const,
	LOADING_TEXT: 'Loading...',
	ERROR_TEXT: 'QR code unavailable',
	RENDER_ERROR_TEXT: 'QR generation failed',
	ALT_TEXT: 'Wallet address QR code for scanning',
	COLORS: {
		DARK: '#000000',
		LIGHT: '#FFFFFF',
	},
} as const;

export const EXPAND_LABELS = {
	EXPAND: 'Expand address',
	COLLAPSE: 'Collapse address',
} as const;
