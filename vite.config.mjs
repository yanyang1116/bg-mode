/**
 * @file
 * tg cli 生成
 * 增加了 tailwind 相关的东西
 * 简单对内容做了批注
 */
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// 加载环境变量
	const env = loadEnv(mode, process.cwd(), '');

	return {
		base: env.VITE_BASE_PATH,
	css: {
		modules: {
			localsConvention: 'camelCase',
		},
		preprocessorOptions: {
			scss: {
				api: 'modern',
			},
		},
	},
	plugins: [
		tailwindcss(),
		// Allows using React dev server along with building a React application with Vite.
		// https://npmjs.com/package/@vitejs/plugin-react-swc
		react(), // 基本整合了 react 开发所需要的所有功能，就这样其他不用关心
		// Allows using the compilerOptions.paths property in tsconfig.json.
		// https://www.npmjs.com/package/vite-tsconfig-paths
		tsconfigPaths(), // 读取 tsconfig.json 文件中的路径，专门处理路径别名
		// Creates a custom SSL certificate valid for the local machine.
		// Using this plugin requires admin rights on the first dev-mode launch.
		// https://www.npmjs.com/package/vite-plugin-mkcert
		// 本地启动 https 时，自签证书，这个我没尝试成功，先放着，不改动这个内容，package.json 里的命令也保留
		// 也可以通过别的代理工具处理 https 的问题，不过它这个和命令参数相结合，还是不错的
		process.env.HTTPS && mkcert(),
	],
	build: {
		target: 'esnext', // tg 小程序不需要考虑兼容性问题
	},
	publicDir: './public',
	server: {
		// Exposes your dev server and makes it accessible for the devices in the same network.
		host: true, // 放开 ip 端口，允许其他设备通过局域网访问 vite 服务，手机真机调试，会用到
		allowedHosts: true // 打开，不然配代理有问题，打开没有任何不利的影响
	},
	};
});
