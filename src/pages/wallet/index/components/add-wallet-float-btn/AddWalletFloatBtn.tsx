/**
 * @file
 * ai 实现，最好也让 ai 改
 */
import { hapticFeedback } from '@telegram-apps/sdk';
import { useDrag } from '@use-gesture/react';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ANIMATION_DURATION, BREAKPOINTS } from './const';
import type { Position, Props } from './types';

export const AddWalletFloatBtn = ({ onClick, className, style }: Props) => {
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [showOverlay, setShowOverlay] = useState(false);
	const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const touchStartTimeRef = useRef<number>(0);
	const [isLongPress, setIsLongPress] = useState(false);

	// 缓存窗口尺寸，减少重复计算
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	// 响应式尺寸计算
	const isMobile = windowSize.width < BREAKPOINTS.MOBILE;
	const componentSize = isMobile ? 40 : 48; // 移动设备稍小
	const initialPadding = isMobile ? 16 : 24; // 移动设备边距更小

	// 缓存边界计算结果
	const bounds = useMemo(() => {
		const initialBottomPosition = windowSize.height * 0.8; // 20%的位置就是距离底部80%

		const maxX = initialPadding; // 向右最多拖到边距位置
		const minX = -(windowSize.width - componentSize - initialPadding); // 向左最多拖到屏幕左边
		const maxY = windowSize.height - initialBottomPosition + initialPadding; // 向下可拖拽的距离
		const minY = -(initialBottomPosition - componentSize - initialPadding); // 向上可拖拽的距离
		return { maxX, minX, maxY, minY };
	}, [windowSize.width, windowSize.height, componentSize, initialPadding]);

	const bind = useDrag(
		({ offset: [ox, oy], first, last, timeStamp }) => {
			if (first) {
				setIsDragging(true);
				setShowOverlay(true);
				setIsLongPress(false);
				touchStartTimeRef.current = timeStamp;
				// 清除之前的延迟隐藏
				if (overlayTimeoutRef.current) {
					clearTimeout(overlayTimeoutRef.current);
					overlayTimeoutRef.current = null;
				}
				// 拖动开始时添加轻微触觉反馈
				try {
					hapticFeedback.impactOccurred('light');
				} catch (error) {
					console.warn('Haptic feedback failed:', error);
				}
			}

			// 限制在边界内 - 直接使用缓存的边界值
			const boundedX = Math.max(bounds.minX, Math.min(bounds.maxX, ox));
			const boundedY = Math.max(bounds.minY, Math.min(bounds.maxY, oy));
			const boundedPosition = { x: boundedX, y: boundedY };

			if (last) {
				setIsDragging(false);
				// 检查是否为长按（超过500ms且没有移动距离）
				const touchDuration = timeStamp - touchStartTimeRef.current;
				const hasMovement = Math.abs(ox) > 5 || Math.abs(oy) > 5; // 容错5px的移动
				if (touchDuration > 500 && !hasMovement) {
					setIsLongPress(true);
				}
				overlayTimeoutRef.current = setTimeout(() => {
					setShowOverlay(false);
					overlayTimeoutRef.current = null;
				}, 180);
			}
			setPosition(boundedPosition);
		},
		{
			filterTaps: true, // 过滤点击事件
		},
	);

	// 监听窗口大小变化
	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		// 使用节流优化 resize 事件
		let resizeTimeout: ReturnType<typeof setTimeout>;
		const throttledResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(handleResize, 100);
		};

		window.addEventListener('resize', throttledResize);
		return () => {
			window.removeEventListener('resize', throttledResize);
			clearTimeout(resizeTimeout);
		};
	}, []);

	// 清理 timeout
	useEffect(() => {
		return () => {
			if (overlayTimeoutRef.current) {
				clearTimeout(overlayTimeoutRef.current);
			}
		};
	}, []);

	const handleClick = useCallback(() => {
		if (isDragging || isLongPress) return;
		onClick();
	}, [isDragging, isLongPress, onClick]);

	return (
		<>
			{/* 拖动时的透明遮罩层 - 阻断下方点击事件 */}
			{showOverlay && (
				<div
					className="fixed inset-0 z-[1] bg-transparent"
					style={{ pointerEvents: 'auto' }}
				/>
			)}

			<div
				{...bind()}
				role="button"
				tabIndex={0}
				aria-label="Add wallet floating button - drag to move around screen, click or press Enter/Space to add wallet"
				className={`fixed z-[2] ${
					isDragging ? 'cursor-grabbing' : 'cursor-grab'
				} ${className || ''}`}
				style={{
					bottom: '10%',
					right: `${initialPadding}px`,
					width: `${componentSize}px`,
					height: `${componentSize}px`,
					transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
					userSelect: 'none',
					touchAction: 'none',
					...style,
				}}
				onKeyDown={useCallback(
					(e: React.KeyboardEvent) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleClick();
						}
					},
					[handleClick],
				)}
			>
				{/* 脉冲背景圈 - 放射效果 */}
				<div
					className="absolute inset-1 bg-green rounded-full animate-ping opacity-90 pointer-events-none"
					style={{ animationDuration: `${ANIMATION_DURATION.PULSE_PING}ms` }}
				/>
				<div
					className="absolute inset-1 bg-green rounded-full animate-pulse opacity-100 pointer-events-none"
					style={{ animationDuration: `${ANIMATION_DURATION.PULSE_ANIMATE}ms` }}
				/>

				{/* 主按钮 */}
				<button
					className="relative bg-green hover:bg-green/90 text-white rounded-full shadow-lg flex items-center justify-center z-10 hover:scale-105 focus:outline-none"
					style={{
						width: `${componentSize}px`,
						height: `${componentSize}px`,
						transform: isDragging ? 'scale(1.1)' : 'scale(1)',
						transition: `transform ${ANIMATION_DURATION.SCALE_TRANSITION}ms ease-out`,
						userSelect: 'none',
						WebkitUserSelect: 'none',
						WebkitTouchCallout: 'none',
						WebkitTapHighlightColor: 'transparent',
					}}
					onClick={useCallback(
						(e: React.MouseEvent) => {
							if (isDragging || isLongPress) {
								e.preventDefault();
								return;
							}
							handleClick();
						},
						[isDragging, isLongPress, handleClick],
					)}
					aria-label="Add new wallet"
					tabIndex={-1}
				>
					<Plus size={isMobile ? 20 : 24} strokeWidth={2.5} />
				</button>
			</div>
		</>
	);
};
