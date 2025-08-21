import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UserState } from './types';

// 导出 localStorage key，供其他地方直接使用
export const USER_STORE_KEY = 'user-store';

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			// 初始状态
			token: null,
			avatar: '',
			name: '',

			// Actions
			setToken: (token: string | null) =>
				set(() => ({
					token,
				})),

			clearToken: () =>
				set(() => ({
					token: null,
				})),

			setUserInfo: ({ avatar, name }) =>
				set(() => ({
					avatar,
					name,
				})),
		}),
		{
			name: USER_STORE_KEY, // 使用常量
			partialize: (state) => ({
				token: state.token,
				avatar: state.avatar,
				name: state.name,
			}), // 持久化 token, avatar, name 字段
		},
	),
);
