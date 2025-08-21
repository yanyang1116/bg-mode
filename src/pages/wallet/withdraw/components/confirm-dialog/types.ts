// 表单数据类型
export type WithdrawFormData = {
	toAddress: string;
	amount: string;
};

export interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: WithdrawFormData | null;
	tokenName: string;
	tokenImg?: string | null;
	onConfirm: () => void;
	isSubmitting: boolean;
}
