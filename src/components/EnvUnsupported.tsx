/**
 * @file
 * tg 版本限制的兜底页面，不需要调整，保持默认
 */
import { isColorDark, isRGB, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { AppRoot, Placeholder } from '@telegram-apps/telegram-ui';
import { useMemo } from 'react';

import publicUrl from '@/utils/public-url';

export function EnvUnsupported() {
	const [platform, isDark] = useMemo(() => {
		try {
			const lp = retrieveLaunchParams();
			const { bg_color: bgColor } = lp.tgWebAppThemeParams;
			return [lp.tgWebAppPlatform, bgColor && isRGB(bgColor) ? isColorDark(bgColor) : false];
		} catch {
			return ['android', false];
		}
	}, []);

	return (
		<AppRoot
			appearance={isDark ? 'dark' : 'light'}
			platform={['macos', 'ios'].includes(platform) ? 'ios' : 'base'}
		>
			<Placeholder
				header="Oops"
				description="You are using too old Telegram client to run this application"
			>
				<img
					alt="Telegram sticker"
					src={publicUrl('/telegram-unsupport-env.gif')}
					style={{ display: 'block', width: '144px', height: '144px' }}
				/>
			</Placeholder>
		</AppRoot>
	);
}
