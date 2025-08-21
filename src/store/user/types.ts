export interface UserState {
	// 用户认证 token
	token: string | null;
	// 用户头像
	avatar: string;
	// 用户名称
	name: string;

	// Actions
	setToken: (token: string | null) => void;
	clearToken: () => void;
	setUserInfo: (params: { avatar: string; name: string }) => void;
}
