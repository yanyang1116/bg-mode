import { COMPONENT_SIZE, INITIAL_POSITION, THRESHOLD } from './const';
import type { Position } from './types';

/**
 * 计算拖拽边界限制
 */
export const calculateBounds = () => {
	const maxX = INITIAL_POSITION.RIGHT; // 向右最多只能拖24px（贴到屏幕右边）
	const minX = -(window.innerWidth - COMPONENT_SIZE - INITIAL_POSITION.RIGHT); // 向左最多拖到屏幕左边
	const maxY = INITIAL_POSITION.BOTTOM; // 向下最多只能拖24px（贴到屏幕底边）
	const minY = -(window.innerHeight - COMPONENT_SIZE - INITIAL_POSITION.BOTTOM); // 向上最多拖到屏幕顶部

	return { maxX, minX, maxY, minY };
};

/**
 * 限制位置在边界内
 */
export const constrainPosition = (position: Position): Position => {
	const { maxX, minX, maxY, minY } = calculateBounds();

	return {
		x: Math.max(minX, Math.min(maxX, position.x)),
		y: Math.max(minY, Math.min(maxY, position.y)),
	};
};

/**
 * 检测是否在屏幕左半边（用于tooltip方向判断）
 */
export const isInLeftSide = (position: Position, windowWidth?: number): boolean => {
	const width = windowWidth || (typeof window !== 'undefined' ? window.innerWidth : 1920);
	return position.x < -(width * THRESHOLD.TOOLTIP_SWITCH);
};

/**
 * 检测tooltip方向是否需要改变
 */
export const shouldFlipTooltip = (
	oldPosition: Position,
	newPosition: Position,
	windowWidth?: number,
): boolean => {
	return isInLeftSide(oldPosition, windowWidth) !== isInLeftSide(newPosition, windowWidth);
};
