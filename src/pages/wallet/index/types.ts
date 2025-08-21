export interface Token {
	name: string;
	icon: string;
	value: string;
}

export interface WalletData {
	id: number;
	name: string;
	isPrimary: boolean;
	address: string;
	solBalance: string;
	solValue: string;
	tokens: Token[];
	tokensValue: string;
}
