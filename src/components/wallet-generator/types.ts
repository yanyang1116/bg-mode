export interface WalletInfo {
	address: string;
	privateKey: string;
}

export interface DragState {
	progress: number;
	maxProgress: number;
	isDragging: boolean;
	isUnlocked: boolean;
}

export enum CopyType {
	ADDRESS = 'address',
	PRIVATE_KEY = 'privateKey',
}

export interface WalletGeneratorModalProps {
	open: boolean;
	onClose: () => void;
	onFinish: () => void;
}
