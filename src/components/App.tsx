/**
 * @file
 * cli 创建的 App 路由布局管理
 * TODO 主要是 AppRoot 这个最好能换掉，搞清楚影响范围，如果不行也不勉强
 */
import {
	isMiniAppDark,
	retrieveLaunchParams,
	useLaunchParams,
	useRawInitData,
	useSignal,
	viewport,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { useRequest } from 'ahooks';
import { isNil } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import store from 'store2';
import { useImmer } from 'use-immer';

import { authTelegramLogin, type Request } from '@/api/user/';
import { GlobalLoading } from '@/components/global-loading';
import { Layout } from '@/components/layout/';
import { Button } from '@/components/shadcn-ui/button';
import { Toaster } from '@/components/shadcn-ui/sonner';
import NotFoundPage from '@/pages/not-found/';
import { routes } from '@/pages/routes';
import { USER_STORE_KEY } from '@/store';
import { useUserStore } from '@/store/user';
import publicUrl from '@/utils/public-url';

// 创建路由配置
const router = createHashRouter([
	{
		path: '/',
		element: <Layout />,
		children: routes,
	},
	// 404 页面独立，不受 Layout 影响
	{ path: '*', element: <NotFoundPage /> },
]);

export function App() {
	const lp = useMemo(() => retrieveLaunchParams(), []);
	const launchParams = useLaunchParams();
	const isDark = useSignal(isMiniAppDark);
	const { token, setToken, setUserInfo } = useUserStore();
	const [hasAttemptedAutoLogin, setHasAttemptedAutoLogin] = useImmer(false);

	// 计算 toast 的安全区域偏移量
	const topSafeDistance = viewport.safeAreaInsetTop();
	const isFullscreen = viewport.isFullscreen();
	const fullscreenOffset = Number(import.meta.env.VITE_FULLSCREEN_TOP_OFFSET) || 45;
	const toastOffset = topSafeDistance + (isFullscreen ? fullscreenOffset : 0) + 16;
	const { runAsync } = useRequest((data: Request.AuthTelegramLogin) => authTelegramLogin(data), {
		manual: true,
	});
	const initData = useRawInitData();

	const handleLogin = () => {
		runAsync({ initDataRaw: initData! })
			.then((res) => {
				if (isNil(res?.token)) return;
				setToken(res.token);
			})
			.finally(() => {
				!hasAttemptedAutoLogin && setHasAttemptedAutoLogin(true);
			});
	};

	/**
	 * 下面这段是主动注入的，目的是为保存一个设备信息，考虑 session 保存
	 * 目的是，在非 tg 环境，这个设备信息，可以被 api 调用器使用，来组织 header
	 */

	useEffect(() => {
		// 自动登录尝试
		const localUserStore = store.get(USER_STORE_KEY);
		const storedToken = localUserStore?.state?.token;

		// 这个不论登不登录，都可以调用
		setUserInfo({
			avatar: launchParams.tgWebAppData?.user?.photo_url ?? publicUrl('/default-avatar.png'),
			name: launchParams.tgWebAppData?.user?.username ?? '-',
		});
		// initTheme(); // 暂时不做了
		if (isNil(storedToken)) handleLogin();
	}, []);

	return (
		<>
			<GlobalLoading />
			<Toaster position="top-center" mobileOffset={{ top: toastOffset }} duration={2000} />
			<AppRoot
				appearance={isDark ? 'dark' : 'light'}
				platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
			>
				{/* 1. 没有 token 且没有尝试过自动登录 - 显示 null */}
				{!token && !hasAttemptedAutoLogin ? null /* 2. 有 token - 显示路由 */ : token ? (
					<RouterProvider router={router} />
				) : (
					/* 3. 没有 token 但已尝试过自动登录 - 显示登录按钮 */
					<div className="flex-center h-screen flex-col space-y-4">
						<h1 className="text-2xl font-bold">Login Expired</h1>
						<p className="text-muted-foreground">
							Please click the button to login again
						</p>
						<Button size="lg" onClick={handleLogin}>
							Login Again
						</Button>
					</div>
				)}
			</AppRoot>
		</>
	);
}
