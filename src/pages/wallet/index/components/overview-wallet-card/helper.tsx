import { UI_CONFIG } from './const';

// 判断是否显示"more"提示
export const shouldShowMoreTokens = (tokensLength: number): boolean => {
	return tokensLength > UI_CONFIG.MAX_VISIBLE_TOKENS;
};
