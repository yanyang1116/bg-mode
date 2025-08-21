// ConfirmDialog 组件相关常量
export const CONFIRM_DIALOG = {
	TITLE: 'Confirm Withdrawal',
	DESCRIPTION: 'Please review your withdrawal details',
	WITHDRAWAL_AMOUNT: 'Withdrawal Amount',
	TO_ADDRESS: 'To Address',
	WARNING: '⚠️ Please double-check the address',
	CONFIRM_BUTTON: 'Confirm',
	CANCEL_BUTTON: 'Cancel',
	SUBMITTING_TEXT: 'Processing...',
	TOKEN_ALT: 'Token',
	// Accessibility labels
	AMOUNT_SECTION_LABEL: 'Withdrawal amount details',
	ADDRESS_SECTION_LABEL: 'Recipient address details',
	WARNING_SECTION_LABEL: 'Important warning about address verification',
	LOADING_BUTTON_ARIA_LABEL: 'Processing withdrawal, please wait',
} as const;
