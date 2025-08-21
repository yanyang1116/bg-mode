import { viewport } from '@telegram-apps/sdk';
import type { FC } from 'react';

interface SafeAreaSpacerProps {
	position: 'top' | 'bottom';
}

export const SafeAreaSpacer: FC<SafeAreaSpacerProps> = ({ position }) => {
	const topSafeDistance = viewport.safeAreaInsetTop();
	const bottomSafeDistance = viewport.safeAreaInsetBottom();
	const isFullscreen = viewport.isFullscreen();

	if (position === 'top') {
		return (
			<>
				{/* 基础安全距离 */}
				<div style={{ height: topSafeDistance }} />

				{/* 全屏模式额外偏移 */}
				{isFullscreen && (
					<div
						style={{
							height: Number(import.meta.env.VITE_FULLSCREEN_TOP_OFFSET) || 45,
						}}
					/>
				)}
			</>
		);
	}

	if (position === 'bottom') {
		return <div style={{ height: bottomSafeDistance }} />;
	}

	return null;
};
