import type { DragState } from './types';

// 重置拖动状态
export const resetDragState = (setDragState: (updater: (draft: DragState) => void) => void) => {
	setDragState((draft) => {
		draft.isUnlocked = false;
		draft.progress = 0;
	});
};

// 计算最大拖动距离
export const calculateMaxDrag = (containerWidth: number, sliderSize: number, padding: number) => {
	return Math.max(0, containerWidth - sliderSize - padding);
};
