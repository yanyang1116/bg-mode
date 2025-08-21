export interface LoadingState {
	isLoading: boolean;
	loadingText?: string;
}

export interface GlobalState {
	// Loading 相关状态
	loading: LoadingState;

	// 引导生成钱包弹窗显示状态
	guideGenerateWalletVisible: boolean;

	// Actions
	showLoading: (text?: string) => void;
	hideLoading: () => void;
	setLoading: (isLoading: boolean, text?: string) => void;
	setGuideGenerateWalletVisible: (visible: boolean) => void;
}
