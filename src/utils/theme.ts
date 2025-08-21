// @deprecated 估计后面也不会用到了，暂时先不删除
// /**
//  * @file
//  * 处理主题的工具函数
//  */
// import { retrieveLaunchParams, type LaunchParams } from '@telegram-apps/sdk';
// import store from 'store2';

// /**
//  * 获取当前主题
//  */
// export function getCurrentTheme(): Base.Theme {
// 	try {
// 		// 优先从 Telegram SDK 获取主题
// 		const launchParams: LaunchParams = retrieveLaunchParams();
// 		if (launchParams?.tgWebAppThemeParams) {
// 			// 直接从 tgWebAppThemeParams 获取主题信息
// 			const tgTheme = launchParams.tgWebAppThemeParams;

// 			// 通过背景色判断主题（Telegram SDK 中可能没有直接的 color_scheme 字段）
// 			const bgColor = tgTheme.bg_color;
// 			if (bgColor) {
// 				// 判断背景色亮度来确定主题
// 				const hex = bgColor.replace('#', '');
// 				const r = parseInt(hex.substr(0, 2), 16);
// 				const g = parseInt(hex.substr(2, 2), 16);
// 				const b = parseInt(hex.substr(4, 2), 16);
// 				const brightness = (r * 299 + g * 587 + b * 114) / 1000;

// 				return brightness < 128 ? 'dark' : 'light';
// 			}
// 		}
// 	} catch (error) {
// 		console.warn('Failed to get theme from Telegram SDK:', error);
// 	}

// 	// 兜底方案：从本地存储获取
// 	const savedTheme = store.get('theme');
// 	if (savedTheme === 'dark' || savedTheme === 'light') {
// 		return savedTheme;
// 	}

// 	// 最终兜底：返回 dark
// 	return 'dark';
// }

// /**
//  * 设置主题
//  */
// export function setTheme(theme: Base.Theme): void {
// 	const html = document.documentElement;

// 	if (theme === 'dark') {
// 		html.classList.add('dark');
// 	} else {
// 		html.classList.remove('dark');
// 	}

// 	store.set('theme', theme);
// }

// /**
//  * 切换主题
//  */
// export function toggleTheme(): Base.Theme {
// 	const newTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
// 	setTheme(newTheme);
// 	return newTheme;
// }

// /**
//  * 初始化主题（应用启动时调用）
//  */
// export function initTheme(): void {
// 	if (typeof window === 'undefined') return;

// 	try {
// 		// 从 Telegram SDK 获取初始主题
// 		const currentTheme = getCurrentTheme();
// 		setTheme(currentTheme);
// 	} catch (error) {
// 		console.warn('Failed to initialize theme from Telegram SDK:', error);
// 		// 兜底设置为 dark
// 		setTheme('dark');
// 	}
// }
