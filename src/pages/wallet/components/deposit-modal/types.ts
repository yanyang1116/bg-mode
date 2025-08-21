export interface DepositModalProps {
	isOpen: boolean;
	onClose: () => void;
	walletAddress: string;
	walletName?: string;
	tokenName?: string;
}

export interface QRCodeDisplayProps {
	address: string;
	size?: number;
}

// QR 码生成选项类型
export interface QRCodeOptions {
	width: number;
	margin: number;
	color: {
		dark: string;
		light: string;
	};
	errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

// 地址展开状态类型
export type AddressExpandState = boolean;

// 复制操作结果类型
export type CopyResult = {
	success: boolean;
	message: string;
};
