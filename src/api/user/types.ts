export type WalletItem = Wallet.WalletItem;

export interface WalletWithdrawHistoryItem {
	fromAddress: string;
	toAddress: string;
	tokenAddress: string;
	amount: string;
	requestTime: string;
	confirmTime: string;
	confirmedBlock: number;
	status: string;
	chain: string;
	fee: string;
	tokenImageUrl: string;
	tokenName: string;
}
