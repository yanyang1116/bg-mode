import { hapticFeedback } from '@telegram-apps/sdk';
import { Copy } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/shadcn-ui/badge';
import { Button } from '@/components/shadcn-ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn-ui/popover';
import { RadioGroupItem } from '@/components/shadcn-ui/radio-group';
import { copyToClipboard } from '@/utils/copy-to-clipboard';
import { formatAddress } from '@/utils/format-address';
import { formatNumber } from '@/utils/format-number';
import publicUrl from '@/utils/public-url';

import { UI_CONFIG } from './const';
import { shouldShowMoreTokens } from './helper';
import type { OverviewWalletCardProps } from './types';

// 钱包卡片组件 - 提取为独立组件提高可读性
export function OverviewWalletCard({ wallet, isVisible, index, onClick }: OverviewWalletCardProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	// 复制地址功能
	const handleCopyAddress = (e: React.MouseEvent) => {
		e.stopPropagation(); // 阻止冒泡到父级点击事件
		copyToClipboard(wallet.address, {
			successMessage: 'Address copied to clipboard',
			errorMessage: 'Failed to copy address',
		});
	};

	// 获取行样式
	const getRowStyle = () => {
		const isOdd = (index + 1) % 2 === 1;
		if (isOdd) {
			return 'py-3 rounded-lg bg-gradient-to-r from-transparent via-secondary/[0.25] to-transparent cursor-pointer hover:bg-secondary/10 transition-colors';
		}
		return 'py-3 rounded-lg bg-gradient-to-r from-transparent via-secondary/60 to-transparent cursor-pointer hover:bg-secondary/20 transition-colors';
	};

	// 渲染资产值的辅助函数
	const renderAssetValue = (value: number | string, prefix = '', hiddenText = '****') => {
		if (!isVisible) {
			return hiddenText;
		}
		return `${prefix}${formatNumber(value, 'price')}`;
	};

	// 处理 radio 列点击事件
	const handleRadioColumnClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		// 如果点击的是已选中的钱包，不触发任何操作
		if (wallet.isPrimary) {
			return;
		}
		// 触觉反馈
		hapticFeedback.impactOccurred('light');
		// 触发 radio 选择
		const radioElement = e.currentTarget.querySelector(
			'button[role="radio"]',
		) as HTMLButtonElement;
		if (radioElement) {
			radioElement.click();
		}
	};

	// 处理 More 按钮点击
	const handleMoreClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsPopoverOpen(!isPopoverOpen);
	};

	return (
		<div className={getRowStyle()} onClick={onClick}>
			<div className="flex items-start">
				{/* 钱包信息 */}
				<div className="flex items-center flex-[3]">
					<div
						className="flex items-center cursor-pointer py-1 px-1 -mx-1 hover:bg-muted/20 rounded transition-colors"
						onClick={handleRadioColumnClick}
					>
						<RadioGroupItem value={wallet.id.toString()} />
					</div>
					<div className="flex-1 ml-3">
						<div className="flex items-center gap-2 relative">
							<h3 className="text-sm font-bold max-w-[7rem] truncate">
								{wallet.name}
							</h3>
							{wallet.isPrimary && (
								<Badge
									variant="secondary"
									className="absolute -top-1 -right-1 text-[0.625rem] px-1.5 py-0.5 bg-primary/20 text-primary border-primary/30 animate-in fade-in-0 scale-in-95 duration-200 z-10"
								>
									Main
								</Badge>
							)}
						</div>
						<div className="flex items-center gap-2 mt-1">
							<p className="text-xs text-muted-foreground/70 font-mono">
								{formatAddress(wallet.address, 8)}
							</p>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleCopyAddress}
								className="opacity-60 hover:opacity-100"
								aria-label={`Copy wallet address ${formatAddress(wallet.address, 8)}`}
							>
								<Copy className="text-muted-foreground " />
							</Button>
						</div>
					</div>
				</div>

				{/* SOL余额 */}
				<div className="flex-[2] text-right overflow-hidden">
					<div className="flex flex-col items-end">
						<div className="flex items-baseline justify-end gap-[0.1875rem]">
							{isVisible ? (
								<>
									<span className="text-sm text-foreground max-w-[4.7em] truncate inline-block">
										{formatNumber(wallet.solBalance, 'price')}
									</span>
									<span className="text-[0.6875rem] text-muted-foreground">
										SOL
									</span>
								</>
							) : (
								<span className="text-sm text-muted-foreground">****</span>
							)}
						</div>
						<span className="text-xs text-muted-foreground mt-2 truncate max-w-[7.5em] inline-block">
							{renderAssetValue(wallet.solValue, '$', '$****')}
						</span>
					</div>
				</div>

				{/* 代币 */}
				<div className="flex-[2] text-right overflow-hidden">
					<div className="flex flex-col items-end">
						<div className="flex items-center justify-end mt-1 gap-1">
							{isVisible ? (
								<>
									{wallet.tokens.length === 0 ? (
										<span className="text-xs text-muted-foreground/50">
											No tokens
										</span>
									) : (
										wallet.tokens
											.slice(0, UI_CONFIG.MAX_VISIBLE_TOKENS)
											.map((token, tokenIndex) => (
												<img
													key={tokenIndex}
													src={
														token.icon ??
														publicUrl('/default-token.svg')
													}
													alt={`${token.name || 'Token'} icon`}
													className="w-5 h-5 rounded-full"
												/>
											))
									)}
								</>
							) : (
								<span className="text-sm text-muted-foreground">****</span>
							)}
						</div>
						{shouldShowMoreTokens(wallet.tokens.length) && (
							<Popover
								modal={true}
								open={isPopoverOpen}
								onOpenChange={setIsPopoverOpen}
							>
								<PopoverTrigger asChild>
									<button
										className="text-[11px] text-primary font-normal text-right mt-1 cursor-pointer opacity-80 hover:opacity-100 transition-opacity pl-2 py-[1px]"
										onClick={handleMoreClick}
										aria-label={`View all ${wallet.tokens.length} tokens`}
									>
										More
									</button>
								</PopoverTrigger>
								<PopoverContent className="w-auto max-w-[80vw] max-h-[60vh] overflow-y-auto p-3">
									<div className="grid grid-cols-4 gap-3">
										{wallet.tokens.map((token, tokenIndex) => (
											<div
												key={tokenIndex}
												className="flex flex-col items-center min-w-0"
											>
												<div className="w-6 h-6 flex-shrink-0">
													<img
														src={
															token.icon ??
															publicUrl('/default-token.svg')
														}
														alt={`${token.name || 'Token'} icon`}
														className="w-6 h-6 rounded-full"
													/>
												</div>
												<span className="text-[0.625rem] text-muted-foreground mt-1 text-center w-full truncate leading-tight">
													{token.name}
												</span>
											</div>
										))}
									</div>
								</PopoverContent>
							</Popover>
						)}
						<span
							className={`text-xs text-muted-foreground truncate max-w-[6em] inline-block ${shouldShowMoreTokens(wallet.tokens.length) ? 'mt-1' : 'mt-2'}`}
						>
							{renderAssetValue(wallet.tokensValue, '$', '$****')}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
