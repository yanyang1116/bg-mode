/** @type {import('lint-staged').Configuration} */
module.exports = {
  // 对所有支持的文件运行 prettier 格式化
  "**/*.(ts|tsx|js|jsx|json|css|scss|md)": ["npm run format"],
};
