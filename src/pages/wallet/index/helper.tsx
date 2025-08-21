import Big from 'big.js';

import { formatNumber } from '@/utils/format-number';

import { BALANCE_TEXT_SIZE } from './const';
import type { Token, WalletData } from './types';

// 转换 API 数据为前端格式
export const transformWalletData = (
	apiWallets: Base.DeepPartial<Wallet.WalletItem>[] | undefined | null,
): WalletData[] => {
	if (!apiWallets) return [];

	const transformedWallets: WalletData[] = [];

	apiWallets.forEach((apiWallet, index) => {
		if (!apiWallet) return;

		// 转换token数据
		const transformedTokens: Token[] = [];
		apiWallet.tokens?.forEach((apiToken) => {
			if (!apiToken) return;
			transformedTokens.push({
				name: apiToken.name ?? '-',
				icon: apiToken.imageUrl ?? '',
				value: Big(apiToken.balanceInUSDC ?? 0).toString(),
			});
		});

		// 转换钱包数据
		const transformedWallet: WalletData = {
			id: index + 1,
			name: apiWallet.name ?? '-',
			isPrimary: apiWallet.primary ?? false,
			address: apiWallet.address ?? '-',
			solBalance: Big(apiWallet.totalBalanceInSOL ?? '0').toString(),
			solValue: Big(apiWallet.totalBalanceInUSDC ?? '0')
				.minus(Big(apiWallet.tokenBalanceInUSDC ?? '0'))
				.toString(), // SOL的USD价值 = 总价值 - token价值
			tokens: transformedTokens,
			tokensValue: Big(apiWallet.tokenBalanceInUSDC ?? '0').toString(),
		};
		transformedWallets.push(transformedWallet);
	});

	return transformedWallets;
};

// 获取余额文本大小样式
export const getBalanceTextSize = (balance: string): string => {
	const { LARGE_THRESHOLD, MEDIUM_THRESHOLD, SMALL_CLASS, MEDIUM_CLASS, LARGE_CLASS } =
		BALANCE_TEXT_SIZE;

	if (balance.length > LARGE_THRESHOLD) return SMALL_CLASS;
	if (balance.length > MEDIUM_THRESHOLD) return MEDIUM_CLASS;
	return LARGE_CLASS;
};

// 格式化总余额显示
export const formatTotalBalance = (value: string | undefined | null): string => {
	return formatNumber(value);
};
