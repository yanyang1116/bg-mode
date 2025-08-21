import { toast } from 'sonner';

import { Button } from '@/components/shadcn-ui/button';
import { TruncatedDisplay } from '@/pages/wallet/components/truncated-display';
import { formatNumber } from '@/utils/format-number';
import publicUrl from '@/utils/public-url';
import { truncateNumber } from '@/utils/truncate-number';

import type { DetailTokenListItemProps } from './types';

export function DetailTokenListItem({
	token,
	index,
	isAssetsVisible,
	onDepositClick,
	onWithdrawClick,
}: DetailTokenListItemProps) {
	const handleTokenAction = (action: 'deposit' | 'withdraw' | 'sell') => {
		if (action === 'deposit' && onDepositClick && token?.address && token?.name) {
			onDepositClick(token.address, token.name);
			return;
		}
		if (action === 'withdraw' && onWithdrawClick && token?.address && token?.name) {
			onWithdrawClick(token.address, token.name);
			return;
		}
		toast.success(`${action} ${token?.name} - Coming soon!`);
	};

	// 使用truncateNumber处理Token的各种数值
	const priceResult = truncateNumber(formatNumber(token?.priceInUSDC));
	const amountResult = truncateNumber(formatNumber(token?.amount));
	const balanceResult = truncateNumber(formatNumber(token?.balanceInUSDC));

	// 渲染数值显示的辅助函数
	const renderTruncatedValue = (
		result: { isTruncated: boolean; original: string; truncated: string },
		prefix = '',
	) => {
		if (result.isTruncated) {
			return (
				<TruncatedDisplay
					originalText={`${prefix}${result.original}`}
					className="max-w-[10rem] truncate block"
				>
					{prefix}
					{result.truncated}
				</TruncatedDisplay>
			);
		}
		return (
			<span className="max-w-[10rem] truncate block">
				{prefix}
				{result.truncated}
			</span>
		);
	};

	// 渲染资产可见性控制的辅助函数
	const renderAssetValue = (
		result: { isTruncated: boolean; original: string; truncated: string },
		prefix = '',
		hiddenText = '****',
	) => {
		if (!isAssetsVisible) {
			return hiddenText;
		}
		return renderTruncatedValue(result, prefix);
	};

	// 获取行样式
	const getRowStyle = () => {
		const opacity = (index + 1) % 2 === 1 ? '[0.25]' : '60';
		return `py-4 rounded-lg bg-gradient-to-r from-transparent via-secondary/${opacity} to-transparent border-b border-border/50`;
	};

	return (
		<div className={getRowStyle()}>
			<div className="flex items-center justify-between">
				{/* 左侧：Token信息 */}
				<div className="flex items-center">
					<img
						src={token?.imageUrl ?? publicUrl('/default-token.svg')}
						alt={`${token?.name ?? 'Token'} logo`}
						className="w-10 h-10 rounded-full mr-3"
					/>
					<div>
						<div className="mb-1">
							<h3 className="text-base font-bold">{token?.name ?? '-'}</h3>
						</div>
						<div className="text-sm text-muted-foreground">
							{renderTruncatedValue(priceResult, '$')}
						</div>
					</div>
				</div>

				{/* 右侧：余额信息 + 操作按钮（定宽） */}
				<div className="flex flex-col items-end w-40">
					{/* 余额信息 */}
					<div className="flex flex-col items-end mb-2">
						<div className="text-base font-semibold">
							{renderAssetValue(amountResult)}
						</div>
						<div className="text-sm text-muted-foreground">
							{renderAssetValue(balanceResult, '$', '$****')}
						</div>
					</div>

					{/* 操作按钮 */}
					<div className="flex gap-2 justify-end">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleTokenAction('withdraw')}
							className="flex-1 text-xs"
							aria-label={`Withdraw ${token?.name ?? 'token'}`}
						>
							Withdraw
						</Button>
						<Button
							variant="secondary"
							size="sm"
							onClick={() => handleTokenAction('deposit')}
							className="flex-1 text-xs"
							aria-label={`Deposit ${token?.name ?? 'token'}`}
						>
							Deposit
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
