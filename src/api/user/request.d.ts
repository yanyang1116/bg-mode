export namespace Request {
	export interface AuthTelegramLogin {
		initDataRaw: string;
	}

	export interface WalletList {
		chain: string;
	}

	export interface WalletWithdraw {
		chain: string;
		fromAddress: string;
		toAddress: string;
		tokenAddress: string;
		amount: string;
	}

	export interface WalletWithdrawHistory extends Api.PaginationRequest {
		address: string;
		chain: string;
	}

	export interface WalletGenerate {
		chain: string;
	}

	export interface WalletSetPrimary {
		address: string;
		chain: string;
	}

	export interface WalletDetail {
		address: string;
		chain: string;
	}

	export interface WalletUpdate {
		chain: string;
		address: string;
		name: string;
	}
}

