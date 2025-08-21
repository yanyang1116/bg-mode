import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { MarketLayout, MarketMain } from '@/pages/market/';
import { TradeLayout, TradeMain } from '@/pages/trade/';
import {
	WalletDetail,
	WalletIndex,
	WalletLayout,
	WalletWithdraw,
	WalletWithdrawHistory,
} from '@/pages/wallet/';

/**
 * 注意 outlet 里的路由，要考虑用子路径
 * 避免 tabbar 定位不到的问题
 */
export const routes: RouteObject[] = [
	{ index: true, element: <Navigate to="/market" replace /> },
	{
		path: 'market',
		element: <MarketLayout />,
		children: [
			{ index: true, element: <MarketMain /> },
			// { path: 'trends', element: <MarketTrends /> },
		],
	},
	{
		path: 'trade',
		element: <TradeLayout />,
		children: [
			{ index: true, element: <TradeMain /> },
			// { path: 'history', element: <TradeHistory /> },
		],
	},
	{
		path: 'wallet',
		element: <WalletLayout />,
		children: [
			{ index: true, element: <WalletIndex /> },
			{ path: 'detail/:id', element: <WalletDetail /> },
			{ path: 'withdraw', element: <WalletWithdraw /> },
			{ path: 'withdraw-history/:id', element: <WalletWithdrawHistory /> },
		],
	},
];
