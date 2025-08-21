import { ChevronDown, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/shadcn-ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/shadcn-ui/dialog';
import { formatAddress } from '@/utils/format-address';
import { isValidSolanaAddress } from '@/utils/solana';

import { ADDRESS_DISPLAY, DEPOSIT_MODAL, EXPAND_LABELS } from './const';
import { handleAddressCopy } from './helper';
import { QRCodeDisplay } from './QRCodeDisplay';
import { QRCodeErrorBoundary } from './QRCodeErrorBoundary';
import type { AddressExpandState, DepositModalProps } from './types';

export function DepositModal({
	isOpen,
	onClose,
	walletAddress,
	walletName,
	tokenName,
}: DepositModalProps) {
	const [isAddressExpanded, setIsAddressExpanded] = useState<AddressExpandState>(false);

	// 当弹窗关闭时重置展开状态
	useEffect(() => {
		if (!isOpen) {
			setIsAddressExpanded(false);
		}
	}, [isOpen]);

	// 校验地址格式
	const isValidAddress = isValidSolanaAddress(walletAddress);
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="mx-auto bg-[var(--card-bg-light)] border-border"
				onInteractOutside={(e) => e.preventDefault()}
			>
				<DialogHeader className="text-left">
					<DialogTitle className="text-left">{DEPOSIT_MODAL.TITLE}</DialogTitle>
					<DialogDescription>
						{DEPOSIT_MODAL.SUBTITLE}
						{walletName && (
							<span className="block mt-2 font-semibold text-foreground">
								To: {walletName}
							</span>
						)}
						{tokenName && (
							<span className="block mt-1 text-sm text-muted-foreground">
								Token: {tokenName}
							</span>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* 二维码和地址并排显示 */}
					<div className="flex gap-4 items-center">
						{/* 二维码区域 */}
						<div className="flex-shrink-0">
							<QRCodeErrorBoundary>
								{isValidAddress ? (
									<QRCodeDisplay address={walletAddress} />
								) : (
									<div className="w-32 h-32 bg-muted/30 rounded-lg flex-center border border-destructive/30">
										<p className="text-sm text-destructive text-center px-2">
											QR generation failed
										</p>
									</div>
								)}
							</QRCodeErrorBoundary>
						</div>

						{/* 地址显示区域 */}
						<div className="bg-muted/30 rounded-xl p-4 flex-1">
							<div className="flex items-center justify-between mb-1">
								<p className="text-xs text-muted-foreground">Wallet Address</p>
								{isValidAddress && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsAddressExpanded(!isAddressExpanded)}
										className="p-1 h-auto w-auto"
										aria-label={
											isAddressExpanded
												? EXPAND_LABELS.COLLAPSE
												: EXPAND_LABELS.EXPAND
										}
									>
										<ChevronDown
											className={`w-4 h-4 text-primary transition-transform ${
												isAddressExpanded ? 'rotate-180' : ''
											}`}
										/>
									</Button>
								)}
							</div>
							<p
								className={`text-sm font-mono break-all leading-relaxed ${
									isValidAddress ? 'text-foreground' : 'text-destructive'
								}`}
								aria-live="polite"
								aria-describedby="address-description"
							>
								{isValidAddress
									? isAddressExpanded
										? walletAddress
										: formatAddress(
												walletAddress,
												ADDRESS_DISPLAY.MOBILE_LENGTH,
											)
									: 'Invalid address'}
							</p>
							<span id="address-description" className="sr-only">
								{isAddressExpanded
									? 'Full wallet address displayed'
									: 'Abbreviated wallet address displayed, click expand button to see full address'}
							</span>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						onClick={() => handleAddressCopy(walletAddress)}
						className="w-full"
						aria-describedby="copy-button-description"
						disabled={!isValidAddress}
					>
						<Copy className="w-4 h-4 mr-2" aria-hidden="true" />
						Copy Address
					</Button>
					<span id="copy-button-description" className="sr-only">
						Copy full wallet address to clipboard
					</span>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
