// 组件尺寸配置
export const COMPONENT_SIZE = 48; // 组件宽高 48px

// 初始位置配置
export const INITIAL_POSITION = {
	RIGHT: 24, // 距右边24px
	BOTTOM: 24, // 距底部24px
};

// 动画时长配置
export const ANIMATION_DURATION = {
	SCALE_TRANSITION: 200, // 缩放过渡时间 (ms)
	TOOLTIP_FLIP: 250, // tooltip翻转动画时间 (ms)
	PULSE_PING: 2000, // 脉冲ping动画时长 (ms)
	PULSE_ANIMATE: 2000, // 脉冲pulse动画时长 (ms)
};

// 阈值配置
export const THRESHOLD = {
	TOOLTIP_SWITCH: 0.25, // tooltip方向切换阈值（屏幕宽度的1/4）
};

// 响应式断点配置
export const BREAKPOINTS = {
	MOBILE: 768, // 小于768px为移动设备
};
