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
import { formatNumber } from '@/utils/format-number';

import { CONFIRM_DIALOG } from './const';
import type { ConfirmDialogProps } from './types';

export function ConfirmDialog({
	open,
	onOpenChange,
	formData,
	tokenName,
	tokenImg,
	onConfirm,
	isSubmitting,
}: ConfirmDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-center">
						{CONFIRM_DIALOG.TITLE}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center text-muted-foreground">
						{CONFIRM_DIALOG.DESCRIPTION}
					</AlertDialogDescription>
				</AlertDialogHeader>

				{formData && (
					<div className="space-y-3 py-2">
						{/* 关键信息卡片 */}
						<div
							className="bg-primary/5 rounded-lg p-4 text-center"
							role="region"
							aria-label={CONFIRM_DIALOG.AMOUNT_SECTION_LABEL}
						>
							<div className="flex items-center justify-center gap-2 mb-2">
								{tokenImg && tokenImg.trim() && (
									<img
										src={tokenImg}
										alt={tokenName || CONFIRM_DIALOG.TOKEN_ALT}
										className="w-5 h-5 rounded-full"
										onError={(e) => {
											e.currentTarget.classList.add('hidden');
										}}
									/>
								)}
								<span className="font-medium text-foreground">
									{tokenName || CONFIRM_DIALOG.TOKEN_ALT}
								</span>
							</div>
							<div
								className="font-bold text-2xl text-primary mb-1"
								aria-label={`Amount: ${formatNumber(formData.amount, 'price')}`}
							>
								{formatNumber(formData.amount, 'price')}
							</div>
							<div className="text-xs text-muted-foreground">
								{CONFIRM_DIALOG.WITHDRAWAL_AMOUNT}
							</div>
						</div>

						{/* 收款地址 */}
						<div
							className="space-y-2"
							role="region"
							aria-label={CONFIRM_DIALOG.ADDRESS_SECTION_LABEL}
						>
							<div className="text-sm font-medium text-foreground">
								{CONFIRM_DIALOG.TO_ADDRESS}
							</div>
							<div className="bg-muted rounded p-3 overflow-hidden">
								<div
									className="font-mono  break-all text-foreground overflow-hidden"
									aria-label={`Recipient address: ${formData.toAddress}`}
									title={formData.toAddress}
								>
									{formData.toAddress}
								</div>
							</div>
						</div>

						{/* 简化的警告提示 */}
						<div
							className="bg-destructive/10 rounded-lg p-3"
							role="alert"
							aria-label={CONFIRM_DIALOG.WARNING_SECTION_LABEL}
						>
							<p className="text-xs text-destructive text-center">
								{CONFIRM_DIALOG.WARNING}
							</p>
						</div>
					</div>
				)}

				<AlertDialogFooter className="gap-3">
					<AlertDialogCancel disabled={isSubmitting} className="flex-1">
						{CONFIRM_DIALOG.CANCEL_BUTTON}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-primary hover:bg-primary/90 flex-1"
						disabled={isSubmitting}
						aria-label={
							isSubmitting ? CONFIRM_DIALOG.LOADING_BUTTON_ARIA_LABEL : undefined
						}
					>
						{isSubmitting
							? CONFIRM_DIALOG.SUBMITTING_TEXT
							: CONFIRM_DIALOG.CONFIRM_BUTTON}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
