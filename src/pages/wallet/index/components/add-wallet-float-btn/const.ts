// 动画时长配置
export const ANIMATION_DURATION = {
	SCALE_TRANSITION: 200, // 缩放过渡时间 (ms)
	PULSE_PING: 2000, // 脉冲ping动画时长 (ms)
	PULSE_ANIMATE: 2000, // 脉冲pulse动画时长 (ms)
} as const;

// 响应式断点配置
export const BREAKPOINTS = {
	MOBILE: 768, // 小于768px为移动设备
} as const;
