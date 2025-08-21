import { zodResolver } from '@hookform/resolvers/zod';
import { hapticFeedback } from '@telegram-apps/sdk';
import { ArrowUpFromLine } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { walletWithdraw } from '@/api/user';
import { Button } from '@/components/shadcn-ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/shadcn-ui/form';
import { Input } from '@/components/shadcn-ui/input';

import { ConfirmDialog, TokenInfo } from './components';
import type { WithdrawFormData } from './components/confirm-dialog';
import { UI_TEXT, WITHDRAW_CONSTANTS } from './const';
import {
	createWithdrawFormSchema,
	filterNumericInput,
	getErrorType,
	parseAvailableAmount,
	validateWithdrawParams,
} from './helper';

export function WalletWithdraw() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [pendingFormData, setPendingFormData] = useState<WithdrawFormData | null>(null);

	// 解析路由参数
	const fromAddress = searchParams.get('fromAddress');
	const chain = searchParams.get('chain');
	const tokenName = searchParams.get('tokenName');
	const tokenAddress = searchParams.get('tokenAddress');
	const walletName = searchParams.get('walletName');
	const availableAmount = searchParams.get('availableAmount');
	const tokenImg = searchParams.get('tokenImg');

	// 验证路由参数
	const validation = validateWithdrawParams({
		fromAddress,
		walletName,
		tokenName,
		tokenAddress,
		chain,
	});

	// 安全解析可用金额（非必需参数，无效时使用 0）
	const safeAvailableAmount = parseAvailableAmount(availableAmount);

	// 关闭对话框辅助函数
	const closeDialog = () => {
		setShowConfirmDialog(false);
		setPendingFormData(null);
	};

	// 初始化表单
	const form = useForm<WithdrawFormData>({
		resolver: zodResolver(createWithdrawFormSchema(safeAvailableAmount)),
		defaultValues: {
			toAddress: '',
			amount: '',
		},
	});

	// 如果参数验证失败，显示错误
	if (!validation.isValid) {
		return (
			<div
				className="bg-background text-foreground flex-center py-16"
				role="main"
				aria-labelledby="error-title"
			>
				<div className="text-center p-8">
					<div className="text-6xl mb-4" aria-hidden="true">
						{UI_TEXT.ERROR_PAGE.ICON}
					</div>
					<h2 id="error-title" className="text-xl font-semibold mb-2">
						{UI_TEXT.ERROR_PAGE.TITLE}
					</h2>
					<p className="text-muted-foreground mb-4">{UI_TEXT.ERROR_PAGE.DESCRIPTION}</p>
					<Button
						variant="ghost"
						onClick={() => window.history.back()}
						className="text-primary hover:underline"
						aria-label="Return to previous page"
					>
						{UI_TEXT.GO_BACK}
					</Button>
				</div>
			</div>
		);
	}

	// 处理表单提交（显示确认弹框）
	const onSubmit = (values: WithdrawFormData) => {
		setPendingFormData(values);
		setShowConfirmDialog(true);
	};

	// 确认提现
	const handleConfirmWithdraw = async () => {
		if (!pendingFormData) return;

		setIsSubmitting(true);

		try {
			await walletWithdraw({
				...pendingFormData,
				fromAddress: fromAddress ?? '',
				tokenAddress: tokenAddress ?? '',
				chain: chain ?? '',
			}).then((res) => {
				if (!res) {
					throw new Error(WITHDRAW_CONSTANTS.ERRORS.UNKNOWN_ERROR);
				}
				toast.success(UI_TEXT.WITHDRAWAL_SUCCESS);
				closeDialog();
				navigate(`/wallet/withdraw-history/${fromAddress}`, { replace: true });
				try {
					hapticFeedback.notificationOccurred('success');
				} catch (error) {
					console.warn('Haptic feedback failed:', error);
				}
			});
		} catch (error) {
			console.error('Withdrawal failed:', error);
			// 根据错误类型显示对应的错误消息
			const errorMessage = getErrorType(error);
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	// 设置最大金额
	const handleMaxAmount = () => {
		form.setValue('amount', safeAvailableAmount);
		// 立即清除该字段的错误状态
		form.clearErrors('amount');
		// 手动触发验证以确保状态同步
		form.trigger('amount');
	};

	return (
		<div className="bg-background text-foreground">
			<div className="p-4 space-y-4">
				{/* Token 信息组件 */}
				<TokenInfo
					tokenImg={tokenImg}
					tokenName={tokenName}
					walletName={walletName}
					availableAmount={safeAvailableAmount}
				/>

				{/* 表单 */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* 目标地址输入 */}
						<FormField
							control={form.control}
							name="toAddress"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										{UI_TEXT.RECIPIENT_ADDRESS}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="text"
											placeholder={UI_TEXT.RECIPIENT_ADDRESS_PLACEHOLDER}
											className="font-mono text-sm"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* 金额输入 */}
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">
										{UI_TEXT.WITHDRAWAL_AMOUNT}
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type="text"
												placeholder="0.00"
												className="font-mono text-sm pr-16"
												inputMode="decimal"
												value={field.value}
												name={field.name}
												onBlur={field.onBlur}
												onChange={(e) => {
													const filteredValue = filterNumericInput(
														e.target.value,
													);
													field.onChange(filteredValue);
												}}
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs font-semibold text-primary hover:bg-primary/10"
												onClick={handleMaxAmount}
											>
												{UI_TEXT.MAX}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* 提现按钮 */}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full py-4 text-base font-semibold"
						>
							{isSubmitting ? (
								<div className="flex items-center gap-2">
									<div
										className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
										aria-hidden="true"
									/>
									{UI_TEXT.PROCESSING}
								</div>
							) : (
								<div className="flex items-center gap-2">
									<ArrowUpFromLine className="w-5 h-5" aria-hidden="true" />
									{UI_TEXT.WITHDRAW}
								</div>
							)}
						</Button>
					</form>
				</Form>

				{/* 查看提现记录按钮 */}
				<Button
					type="button"
					variant="ghost"
					className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
					onClick={() => {
						navigate(`/wallet/withdraw-history/${fromAddress}`);
					}}
				>
					{UI_TEXT.WITHDRAWAL_HISTORY}
				</Button>

				{/* 确认对话框组件 */}
				<ConfirmDialog
					open={showConfirmDialog}
					onOpenChange={setShowConfirmDialog}
					formData={pendingFormData}
					tokenName={tokenName || ''}
					tokenImg={tokenImg}
					onConfirm={handleConfirmWithdraw}
					isSubmitting={isSubmitting}
				/>
			</div>
		</div>
	);
}
