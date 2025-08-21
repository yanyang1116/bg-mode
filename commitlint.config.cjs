/**
 * @file
 * 加 jsdoc 类型注解需要额外安装包，无必要
 */
module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat', // 新功能
				'fix', // 修复
				'docs', // 文档变更
				'style', // 代码格式
				'refactor', // 重构
				'perf', // 性能优化
				'test', // 增加测试
				'chore', // 构建过程或辅助工具的变动
				'revert', // 回退
				'build', // 打包
			],
		],
		'type-empty': [2, 'never'],
		'scope-empty': [1, 'always'],
		'subject-empty': [2, 'never'],
		'header-max-length': [1, 'always', 300],
	},
};
