import type { WalletItem, WalletWithdrawHistoryItem } from './types';

export namespace Response {
	export interface AuthTelegramLogin {
		token: string;
	}

	export interface WalletList {
		totalBalanceInSOL: string;
		totalBalanceInUSDC: string;
		wallets: WalletItem[];
	}

	export type WalletWithdrawHistory = Api.PaginationResponse<WalletWithdrawHistoryItem>;

	export interface WalletGenerate {
		pubkey: string;
		privateKey: string;
	}

	export type WalletSetPrimary = Response.WalletList;

	export type WalletDetail = WalletItem;

	export type WalletUpdate = Response.WalletList;
}

