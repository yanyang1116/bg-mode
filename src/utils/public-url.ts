/**
 * @file
 * cli 创建的工具函数
 * 用的地方还挺多的，很有用
 *
 * 主要是有些文件需要放到 public 目录下，直接复制
 * 这个函数主要是为了如果是这些文件的时候，如果来获取正确的路径
 * 目前还是随项目一起打包的，所以都是以项目部署路径展开
 *
 * 这个 public 就是 vite 配置项中的 publicDir: './public'
 * vite 对这个的默认行为是打包的时候把他们复制到和 index.html 同级
 * @returns A complete public URL prefixed with the public static assets base
 * path.
 * @param path - path to prepend prefix to
 */
export default (path: string) => {
	// The baseUrl must be ending with the slash. The reason is if the baseUrl will
	// equal to "/my-base", then passing the path equal to "tonconnect-manifest.json" will not
	// give us the expected result, it will actually be "/tonconnect-manifest.json", but the expected
	// one is "/my-base/tonconnect-manifest.json". This is due to the URL constructor.
	let baseUrl = import.meta.env.VITE_PUBLIC_URL;
	if (!baseUrl.endsWith('/')) {
		baseUrl += '/';
	}

	let isBaseAbsolute = false;
	try {
		new URL(baseUrl);
		isBaseAbsolute = true;
	} catch {
		/* empty */
	}

	return new URL(
		// The path is not allowed to be starting with the slash as long as it will break the
		// base URL. For instance, having the "/my-base/" base URL and path
		// equal to "/tonconnect-manifest.json", we will not get the expected result like
		// "/my-base/tonconnect-manifest.json", but "/tonconnect-manifest.json".
		path.replace(/^\/+/, ''),
		isBaseAbsolute ? baseUrl : window.location.origin + baseUrl,
	).toString();
};
