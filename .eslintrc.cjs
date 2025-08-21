/**
 * @file
 * 加 jsdoc 类型注解需要额外安装包，无必要
 */
module.exports = {
	extends: ["@nxlibs/eslint-config/react"],
	rules: {
		// start
		// TODO  这几个在 @nxlibs/eslint-config/react 配置项里调整下
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'import/order': [
				'warn',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'type',
					],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
		}
		// end
		// 下方开始写，额外定制
};
