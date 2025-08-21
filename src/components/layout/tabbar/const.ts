import { ArrowLeftRight, TrendingUp, Wallet } from 'lucide-react';

import type { TabItem } from './types';

export const TABS: TabItem[] = [
	{
		id: 'market',
		label: 'Market',
		icon: TrendingUp,
		path: '/market',
	},
	{
		id: 'trade',
		label: 'Trade',
		icon: ArrowLeftRight,
		path: '/trade',
	},
	{
		id: 'wallet',
		label: 'Wallet',
		icon: Wallet,
		path: '/wallet',
	},
];

export const ANIMATION_CONFIG = {
	DURATION: 300,
	EASING: 'ease-out',
	SPRING: {
		type: 'spring' as const,
		stiffness: 300,
		damping: 30,
	},
} as const;
