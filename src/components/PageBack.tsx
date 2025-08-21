/**
 * @file
 * cli 生成的组件，保留，无需修改
 * 受控组件，控制 tg 导航栏的回退按钮的显示与隐藏
 */
import { hideBackButton, onBackButtonClick, showBackButton } from '@telegram-apps/sdk-react';
import { type PropsWithChildren, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { routes } from '@/pages/routes';

// 获取所有一级路由路径
const getFirstLevelPaths = () => {
	const paths = [];

	for (const route of routes) {
		// 处理 index: true 的情况，重定向到 /market
		if (route.index) {
			paths.push('/market');
		} else if (route.path) {
			paths.push(`/${route.path}`);
		}
	}

	return paths;
};

export function PageBack({ children }: PropsWithChildren) {
	const navigate = useNavigate();
	const location = useLocation();

	// 判断是否应该显示返回按钮
	const shouldShowBackButton = () => {
		const pathname = location.pathname;
		const firstLevelPaths = getFirstLevelPaths();

		// 如果是一级路由，不显示返回按钮
		const isFirstLevelRoute = firstLevelPaths.some((path) => pathname === path);
		if (isFirstLevelRoute) {
			return false;
		}

		// 判断是否为 404 路由（不在任何已定义路由范围内）
		const isWithinDefinedRoutes = firstLevelPaths.some((path) => pathname.startsWith(path));
		if (!isWithinDefinedRoutes) {
			return false; // 404 页面不显示返回按钮
		}

		// 其他所有情况（二级及以下路由）都显示返回按钮
		return true;
	};

	const back = shouldShowBackButton();

	useEffect(() => {
		if (back) {
			showBackButton();
			return onBackButtonClick(() => {
				navigate(-1);
			});
		}
		hideBackButton();
	}, [back, navigate, location.pathname]);

	return <>{children}</>;
}
