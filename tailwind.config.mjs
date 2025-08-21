/**
 * @file
 * Tailwind CSS 配置 - 与 theme.css 中的 shadcn/ui 系统对齐
 * @type {import('tailwindcss').Config}
 */

/** @type {import('tailwindcss').Config} */
const config = {
	// important: true,
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

	// https://github.com/tailwindlabs/tailwindcss-intellisense/issues/1414
	// 用变量，要 tailwindcss-intellisense 牺牲色彩装饰器的可见性，暂时忍一忍吧
	theme: {
		colors: {
			// 保留必要的默认颜色
			transparent: 'transparent',
			current: 'currentColor',
			white: '#ffffff',
			black: '#000000',
			green: 'var(--green)',

			// 黄色 - 用于状态指示
			yellow: {
				light: 'var(--yellow-light)', // 淡黄 - 背景色
				DEFAULT: 'var(--yellow)', // 主黄 - 文字色
			},

			// shadcn/ui 主题变量 - 与 theme.css 对齐
			background: 'var(--background)',
			foreground: 'var(--foreground)',
			card: {
				DEFAULT: 'var(--card)',
				foreground: 'var(--card-foreground)',
			},
			popover: {
				DEFAULT: 'var(--popover)',
				foreground: 'var(--popover-foreground)',
			},
			primary: {
				DEFAULT: 'var(--primary)',
				foreground: 'var(--primary-foreground)',
			},
			secondary: {
				DEFAULT: 'var(--secondary)',
				foreground: 'var(--secondary-foreground)',
			},
			muted: {
				DEFAULT: 'var(--muted)',
				foreground: 'var(--muted-foreground)',
			},
			accent: {
				DEFAULT: 'var(--accent)',
				foreground: 'var(--accent-foreground)',
			},
			destructive: {
				DEFAULT: 'var(--destructive)',
				foreground: 'var(--destructive-foreground)',
			},
			border: 'var(--border)',
			input: 'var(--input)',
			ring: 'var(--ring)',
		},
		// border 还是和 shadcn/ui 保持一致吧，从 :root 中获取变量
		borderRadius: {
			sm: 'calc(var(--radius) - 4px)',
			md: 'calc(var(--radius) - 2px)',
			lg: 'var(--radius)',
			xl: 'calc(var(--radius) + 4px)',
		},
		extend: {
			fontFamily: {
				'app-font': 'PingFang SC, Microsoft YaHei, sans-serif',
			},
		},
	},
	plugins: [
		/**
		 * Tailwind CSS 插件函数
		 * @param {object} helpers - Tailwind 插件助手函数
		 * @param {Function} helpers.addUtilities - 添加工具类
		 */
		({ addUtilities }) => {
			// 工具类
			addUtilities({
				'.flex-center': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				},
				'.grid-center': {
					display: 'grid',
					alignItems: 'center',
					justifyContent: 'center',
				},
				'.position-full': {
					inset: '0',
					// tg 不需要考虑兼容性，直接用 inset
					// top: '0',
					// left: '0',
					// right: '0',
					// bottom: '0',
				},
				'.z-mask': {
					zIndex: '50', // shadcn 是 50
				},
				'.z-overlay-content': {
					zIndex: '50', // shadcn 内容也是 50，先这样吧
				},
			});
		},
	],
};

export default config;
