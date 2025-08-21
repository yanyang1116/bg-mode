// 路由参数类型
export interface WithdrawParams {
	fromAddress: string | null;
	chain: string | null;
	tokenName: string | null;
	tokenAddress: string | null;
	walletName: string | null;
	availableAmount: string | null;
	tokenImg: string | null;
}

// 参数验证结果类型
export interface ValidationResult {
	isValid: boolean;
	missingParams: string[];
	isAddressValid: boolean;
	isTokenAddressValid: boolean;
}
