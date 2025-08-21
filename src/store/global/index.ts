import { create } from 'zustand';

import type { GlobalState } from './types';

export const useGlobalStore = create<GlobalState>()((set) => ({
	// 初始状态
	loading: {
		isLoading: false,
		loadingText: undefined,
	},

	// 引导生成钱包弹窗显示状态
	guideGenerateWalletVisible: false,

	// Actions
	showLoading: (text?: string) =>
		set(() => ({
			loading: {
				isLoading: true,
				loadingText: text,
			},
		})),

	hideLoading: () =>
		set(() => ({
			loading: {
				isLoading: false,
				loadingText: undefined,
			},
		})),

	setLoading: (isLoading: boolean, text?: string) =>
		set(() => ({
			loading: {
				isLoading,
				loadingText: isLoading ? text : undefined,
			},
		})),

	setGuideGenerateWalletVisible: (visible: boolean) =>
		set(() => ({
			guideGenerateWalletVisible: visible,
		})),
}));
