export type TokenData = Wallet.TokenItem;

export interface DetailTokenListItemProps {
	token: Base.DeepPartial<TokenData>;
	index: number;
	isAssetsVisible: boolean;
	onDepositClick?: (tokenAddress: string, tokenName: string) => void;
	onWithdrawClick?: (tokenAddress: string, tokenName: string) => void;
}
