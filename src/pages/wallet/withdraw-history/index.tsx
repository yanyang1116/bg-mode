import { useRequest } from 'ahooks';
import { ArrowUpFromLine, CheckCircle, Clock, Receipt, XCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { walletWithdrawHistory } from '@/api/user/';
import type { WalletWithdrawHistoryItem } from '@/api/user/types';
import { useGlobalStore } from '@/store/global';
import { formatDate } from '@/utils/format-date';
import { formatNumber } from '@/utils/format-number';
import publicUrl from '@/utils/public-url';

// 常量定义
const SOLANA_TOKEN_ADDRESS = 'So11111111111111111111111111111111111111111';

export function WalletWithdrawHistory() {
	const { id: walletAddress } = useParams<{ id: string }>();
	const { showLoading, hideLoading } = useGlobalStore();

	// 获取提现历史数据
	const { data: historyData } = useRequest(
		() => {
			if (!walletAddress) return Promise.reject('No wallet address');
			return walletWithdrawHistory({
				address: walletAddress,
				chain: 'solana', // TODO 先写死吧，服务端后面也要改
				pageIndex: 1,
				pageSize: 999,
			});
		},
		{
			ready: !!walletAddress,
			refreshDeps: [walletAddress],
			onBefore: () => {
				showLoading('Loading withdrawal history...');
			},
			onSuccess: () => {
				hideLoading();
			},
			onError: () => {
				hideLoading();
			},
		},
	);

	const historyList = historyData?.rows || [];

	// 获取状态对应的图标和颜色
	const getStatusInfo = (status: string) => {
		switch (status.toUpperCase()) {
			case 'INIT':
				return {
					icon: Clock,
					color: 'text-muted-foreground',
					bgColor: 'bg-muted',
					text: 'Initializing',
				};
			case 'PENDING':
				return {
					icon: Clock,
					color: 'text-yellow',
					bgColor: 'bg-yellow-light',
					text: 'Pending',
				};
			case 'SUCCESS':
				return {
					icon: CheckCircle,
					color: 'text-green',
					bgColor: 'bg-green/50',
					text: 'Success',
				};
			case 'FAILED':
				return {
					icon: XCircle,
					color: 'text-destructive',
					bgColor: 'bg-destructive/50',
					text: 'Failed',
				};
			default:
				return {
					icon: Clock,
					color: 'text-muted-foreground',
					bgColor: 'bg-muted',
					text: status,
				};
		}
	};

	// 渲染历史记录项
	const renderHistoryItem = (item: WalletWithdrawHistoryItem, index: number) => {
		const statusInfo = getStatusInfo(item.status);
		const StatusIcon = statusInfo.icon;

		// 检查是否为 Solana 原生代币
		const isSolanaToken = item.tokenAddress === SOLANA_TOKEN_ADDRESS;
		const tokenName = isSolanaToken ? 'Solana' : item.tokenName || 'Unknown Token';
		const tokenImageUrl = isSolanaToken ? publicUrl('/solana.svg') : item.tokenImageUrl;

		return (
			<div key={index} className="bg-card border border-border rounded-lg p-4 mb-3">
				{/* 头部：代币信息和状态 */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center space-x-3">
						{/* 代币图标 */}
						<div className="w-10 h-10 rounded-full bg-muted flex-center overflow-hidden">
							{tokenImageUrl ? (
								<img
									src={tokenImageUrl}
									alt={tokenName}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex-center bg-muted/50">
									<ArrowUpFromLine className="w-5 h-5 text-muted-foreground" />
								</div>
							)}
						</div>

						{/* 代币名称和操作 */}
						<div>
							<h3 className="font-semibold text-sm">{tokenName}</h3>
							<p className="text-xs text-muted-foreground">
								{formatDate(item.requestTime)}
							</p>
						</div>
					</div>

					{/* 状态标识 */}
					<div className="flex items-center space-x-1">
						<StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
						<span className={`text-xs font-medium ${statusInfo.color}`}>
							{statusInfo.text}
						</span>
					</div>
				</div>

				{/* 金额信息 */}
				<div className="bg-muted/30 rounded-lg p-3 mb-3">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<span className="text-xs text-muted-foreground block mb-1">Amount</span>
							<span className="font-semibold text-sm">
								{formatNumber(item.amount)}
							</span>
						</div>
						<div>
							<span className="text-xs text-muted-foreground block mb-1">Fee</span>
							<span className="font-semibold text-sm">
								{item.status.toUpperCase() === 'SUCCESS'
									? formatNumber(item.fee)
									: '-'}
							</span>
						</div>
					</div>
				</div>

				{/* 地址信息 */}
				<div className="space-y-3 text-sm">
					<div>
						<span className="text-xs text-muted-foreground block mb-1">From</span>
						<div className="bg-muted/50 rounded-md px-3 py-2">
							<span className="font-mono text-xs break-all">{item.fromAddress}</span>
						</div>
					</div>

					<div>
						<span className="text-xs text-muted-foreground block mb-1">To</span>
						<div className="bg-muted/50 rounded-md px-3 py-2">
							<span className="font-mono text-xs break-all">{item.toAddress}</span>
						</div>
					</div>
				</div>

				{/* 确认信息 */}
				{(item.confirmTime || item.confirmedBlock) && (
					<div className="mt-3 pt-3 border-t border-border">
						<div className="grid grid-cols-1 gap-2 text-sm">
							{item.confirmTime && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Confirmed</span>
									<span className="text-xs">{formatDate(item.confirmTime)}</span>
								</div>
							)}
							{item.confirmedBlock && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Block</span>
									<span className="text-xs font-mono">
										{item.confirmedBlock.toLocaleString()}
									</span>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="bg-background text-foreground">
			<div className="p-3">
				{/* 标题 */}
				<div className="text-center pt-2 pb-4">
					<h1 className="text-xl font-semibold">Withdrawal History</h1>
				</div>

				{historyList.length === 0 ? (
					/* 空状态 */
					<div className="flex-center flex-col py-24">
						<div className="w-16 h-16 rounded-full bg-muted flex-center mb-4">
							<Receipt className="w-8 h-8 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-medium text-muted-foreground">
							No withdrawal records
						</h3>
					</div>
				) : (
					/* 历史记录列表 */
					<div className="space-y-0">
						{historyList.map((item, index) =>
							renderHistoryItem(item as WalletWithdrawHistoryItem, index),
						)}
					</div>
				)}
			</div>
		</div>
	);
}
