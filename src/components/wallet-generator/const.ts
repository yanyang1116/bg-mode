export const SLIDER_CONFIG = {
	// 滑动条尺寸
	CONTAINER_WIDTH: 280,
	CONTAINER_HEIGHT: 48,
	SLIDER_SIZE: 40,
	PADDING: 8,
	BORDER_RADIUS: 24,

	// 拖动相关
	INITIAL_MAX_PROGRESS: 232, // 初始边界值，会在运行时重新计算
	UNLOCK_THRESHOLD: 0.95,
	RESET_DELAY: 50,
} as const;

export const UI_CONFIG = {
	// 私钥显示触发阈值
	PRIVATE_KEY_REVEAL_THRESHOLD: 50,
	// 对话框关闭延迟
	DIALOG_CLOSE_DELAY: 300,
} as const;
