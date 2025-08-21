/**
 * @file
 * 入口文件会加载
 */
import {
	bindThemeParamsCssVars,
	bindViewportCssVars,
	emitEvent,
	init as initSDK,
	miniApp,
	mockTelegramEnv,
	mountBackButton,
	mountViewport,
	restoreInitData,
	retrieveLaunchParams,
	setDebug,
	swipeBehavior,
	type ThemeParams,
	themeParamsState,
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: {
	debug: boolean;
	eruda: boolean;
	mockForMacOS: boolean;
}): Promise<void> {
	// Set @telegram-apps/sdk-react debug mode and initialize it.
	setDebug(options.debug);
	initSDK();

	// 禁用滑动
	if (swipeBehavior.isSupported()) {
		// 初始化
		swipeBehavior.mount();
		// 禁用垂直滑动关闭行为
		swipeBehavior.disableVertical();
	}

	// Add Eruda if needed.
	options.eruda &&
		void import('eruda').then(({ default: eruda }) => {
			eruda.init();
			eruda.position({ x: window.innerWidth - 50, y: 0 });
		});

	// Telegram for macOS has a ton of bugs, including cases, when the client doesn't
	// even response to the "web_app_request_theme" method. It also generates an incorrect
	// event for the "web_app_request_safe_area" method.
	if (options.mockForMacOS) {
		let firstThemeSent = false;
		mockTelegramEnv({
			onEvent(event, next) {
				if (event[0] === 'web_app_request_theme') {
					let tp: ThemeParams = {};
					if (firstThemeSent) {
						tp = themeParamsState();
					} else {
						firstThemeSent = true;
						tp ||= retrieveLaunchParams().tgWebAppThemeParams;
					}
					return emitEvent('theme_changed', { theme_params: tp });
				}

				if (event[0] === 'web_app_request_safe_area') {
					return emitEvent('safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 });
				}

				next();
			},
		});
	}

	// Mount all components used in the project.
	mountBackButton.ifAvailable();
	restoreInitData();

	if (miniApp.mountSync.isAvailable()) {
		miniApp.mountSync();
		bindThemeParamsCssVars();
	}

	mountViewport.isAvailable() &&
		mountViewport().then(() => {
			bindViewportCssVars();
		});
}
