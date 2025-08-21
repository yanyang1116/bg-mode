import type { WalletData } from '../../types';

export interface OverviewWalletCardProps {
	wallet: WalletData;
	isVisible: boolean;
	index: number;
	onClick?: () => void;
}
