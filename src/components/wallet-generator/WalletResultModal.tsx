import { AlertTriangle, Copy } from 'lucide-react';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/shadcn-ui/alert';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/shadcn-ui/alert-dialog';
import { Button } from '@/components/shadcn-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn-ui/dialog';
import { copyToClipboard } from '@/utils/copy-to-clipboard';

import { UI_CONFIG } from './const';
import type { WalletInfo } from './types';
import { CopyType } from './types';

interface WalletResultModalProps {
	open: boolean;
	onConfirm: () => void;
	walletData: WalletInfo;
}

const WalletResultModal: FC<WalletResultModalProps> = ({ open, onConfirm, walletData }) => {
	const [showPrivateKey, setShowPrivateKey] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const handleCopyToClipboard = useCallback((text: string, type: CopyType) => {
		copyToClipboard(text, {
			successMessage: `${type === CopyType.ADDRESS ? 'Address' : 'Private key'} copied to clipboard`,
			errorMessage: 'Failed to copy to clipboard',
		});
	}, []);

	// 弹窗关闭时重置所有状态
	useEffect(() => {
		if (!open) {
			setShowPrivateKey(false);
			setShowConfirmDialog(false);
		}
	}, [open]);

	// 处理确认
	const handleConfirm = () => {
		setShowConfirmDialog(false);

		setTimeout(() => {
			onConfirm(); // 这个要加延时，不然嵌套的场景有 bug
		}, UI_CONFIG.DIALOG_CLOSE_DELAY);
	};

	const renderPrivateKey = () => {
		if (showPrivateKey) {
			return walletData.privateKey;
		}
		// 创建模糊效果的占位符
		return '•'.repeat(walletData.privateKey.length);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={() => {}}>
				<DialogContent className="bg-card border-border" showCloseButton={false}>
					<DialogHeader>
						<DialogTitle className="text-foreground text-xl font-semibold text-center">
							🎉 Generated Successfully
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* 安全提示 */}
						<Alert variant="destructive" className="">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								Keep private key secure, never share
							</AlertDescription>
						</Alert>

						{/* 钱包地址 */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="walletAddress"
									className="text-sm font-medium text-muted-foreground"
								>
									Wallet Address
								</label>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										handleCopyToClipboard(walletData.address, CopyType.ADDRESS)
									}
									className="shrink-0"
									aria-label="Copy wallet address"
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
							<div className="bg-muted rounded-lg p-3 text-xs font-mono break-all">
								{walletData.address}
							</div>
						</div>

						{/* 私钥 */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="privateKey"
									className="text-sm font-medium text-muted-foreground"
								>
									Private Key
								</label>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										handleCopyToClipboard(
											walletData.privateKey,
											CopyType.PRIVATE_KEY,
										)
									}
									className="shrink-0"
									disabled={!showPrivateKey}
									aria-label="Copy private key"
								>
									<Copy className="h-4 w-4" />
								</Button>
							</div>
							<div
								className="bg-muted rounded-lg p-3 text-xs font-mono break-all relative cursor-pointer"
								onClick={() => setShowPrivateKey(!showPrivateKey)}
								role="button"
								tabIndex={0}
								aria-label="Click to reveal private key"
								onKeyDown={(e: React.KeyboardEvent) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										setShowPrivateKey(!showPrivateKey);
									}
								}}
							>
								<span
									className={showPrivateKey ? '' : 'filter blur-sm select-none'}
								>
									{renderPrivateKey()}
								</span>
								{!showPrivateKey && (
									<div className="absolute inset-0 flex-center">
										<span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
											Click to reveal
										</span>
									</div>
								)}
							</div>
						</div>

						{/* 确认按钮 */}
						<div className="pt-4">
							<Button
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base"
								size="lg"
								onClick={() => setShowConfirmDialog(true)}
							>
								Got it, safely stored
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* 分离的确认对话框 */}
			<AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Wallet Storage</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you have safely stored your wallet information? Once
							closed, you won&apos;t be able to access it again.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>
							Yes, I&apos;ve stored it safely
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default WalletResultModal;
