/**
 * @file
 * 此类文件的修改，一定要重启编辑器，确保加载成功
 *
 * 这个文件需要和 .editorconfig 保持一致，以确保一些制表符，换行符的一致性
 */
// TODO，这个包需要暴露一个类型声明
const prettierConfig = require("@nxlibs/prettier-config");

/**
 * @type {import("prettier").Config}
 */
module.exports = {
	...prettierConfig,
};
