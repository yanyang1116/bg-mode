// 常量定义
const ELLIPSIS = '...' as const;
const ELLIPSIS_LENGTH = ELLIPSIS.length;
const DEFAULT_MAX_LENGTH = 15;
const MIN_VALID_LENGTH = ELLIPSIS_LENGTH + 2; // 至少需要省略号 + 前后各1字符

// 返回值类型定义
interface TruncateResult {
	truncated: string;
	isTruncated: boolean;
	original: string;
}

/**
 * 截断过长的数字字符串，用于详情页面显示
 * 当数字字符串过长时，保留前后部分，中间用省略号替代
 * @param {string} formattedString - 已格式化的数字字符串
 * @param {number} [maxLength=15] - 允许的最大字符长度，必须大于等于5
 * @returns {TruncateResult} 包含截断结果、是否截断标志和原始字符串的对象
 * @throws {Error} 当参数类型不正确或maxLength过小时抛出错误
 */
export function truncateNumber(
	formattedString: string,
	maxLength: number = DEFAULT_MAX_LENGTH,
): TruncateResult {
	// 参数验证
	if (typeof formattedString !== 'string') {
		throw new Error('formattedString must be a string');
	}

	if (
		typeof maxLength !== 'number' ||
		!Number.isInteger(maxLength) ||
		maxLength < MIN_VALID_LENGTH
	) {
		throw new Error(`maxLength must be an integer >= ${MIN_VALID_LENGTH}`);
	}

	// 空字符串处理
	if (!formattedString) {
		return {
			truncated: '',
			isTruncated: false,
			original: formattedString,
		};
	}

	// 如果长度在限制内，直接返回
	if (formattedString.length <= maxLength) {
		return {
			truncated: formattedString,
			isTruncated: false,
			original: formattedString,
		};
	}

	// 计算前后保留的字符数
	const frontLength = Math.floor((maxLength - ELLIPSIS_LENGTH) / 2);
	const backLength = maxLength - ELLIPSIS_LENGTH - frontLength;

	// 提取前后部分
	const front = formattedString.slice(0, frontLength);
	const back = formattedString.slice(-backLength);

	return {
		truncated: `${front}${ELLIPSIS}${back}`,
		isTruncated: true,
		original: formattedString,
	};
}

export default truncateNumber;
