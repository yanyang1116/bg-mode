/**
 * @file
 * 补充一些没有类型，第三方模块申明
 *
 * 这个文件，不能 import 任何东西，不然会变成私有模块（记一笔，之前知道但是老忘记，导致问题看了很久）
 * 用 ///
 *
 * 这里通过引入 vite/client 来扩展全局类型
 */

/// <reference types="vite/client" />
/// <reference types="prettier" />

// TODO，这个包可以暴露一个类型声明
declare module '@nxlibs/prettier-config' {
	const config: Prettier.Config;
	export = config;
}
