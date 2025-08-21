import { create } from 'zustand';

import type { WalletState } from './types';

export const useWalletStore = create<WalletState>()((set) => ({
	currentWallet: null,

	// Actions
	setCurrentWallet: (wallet) =>
		set(() => ({
			currentWallet: wallet,
		})),
}));
