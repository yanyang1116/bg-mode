/**
 * @file
 * 入口文件，大部分是 cli 生成的内容
 */
// Include Telegram UI styles first to allow our code override the package CSS.
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { Root } from '@/components/Root.tsx';
import { init } from '@/init.ts';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';
import './theme.css';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
	const launchParams = retrieveLaunchParams();
	const { tgWebAppPlatform: platform } = launchParams;

	// 这行代码保留，判断是否是开发环境，并且开启 eruda。platformer_debug 是 tg 加的
	const debug =
		(launchParams.tgWebAppStartParam || '').includes('platformer_debug') ||
		import.meta.env.DEV ||
		import.meta.env.VITE_DEPLOY_ENV === 'test';

	// Configure all application dependencies.
	await init({
		debug,
		eruda: debug, // 开发环境打开 eruda
		mockForMacOS: platform === 'macos',
	}).then(() => {
		root.render(
			<StrictMode>
				<Root />
			</StrictMode>,
		);
	});
} catch (e) {
	root.render(<EnvUnsupported />);
}
