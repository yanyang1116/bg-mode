export interface WalletState {
	// 当前选中的钱包（内存状态，不持久化）
	currentWallet: Base.DeepPartial<Wallet.WalletItem> | null;

	// Actions
	setCurrentWallet: (wallet: Base.DeepPartial<Wallet.WalletItem> | null) => void;
}
