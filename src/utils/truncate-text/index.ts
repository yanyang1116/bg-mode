// 常量定义
const ELLIPSIS = '...' as const;
const ELLIPSIS_LENGTH = ELLIPSIS.length;
const DEFAULT_MAX_LENGTH = 20; // 文本通常比数字更长，默认值调整为20
const MIN_TRUNCATE_LENGTH = ELLIPSIS_LENGTH + 2; // 截断操作的最小长度：省略号 + 前后各1字符
const EMPTY_VALUE = '-' as const;

// 输入类型定义
type TextInput = string | number | boolean | null | undefined | object;

// 返回值类型定义
interface TruncateTextResult {
	truncated: string;
	isTruncated: boolean;
	original: string;
}

/**
 * 截断过长的文本字符串，用于UI显示
 * 当文本字符串过长时，保留前后部分，中间用省略号替代
 * @param {TextInput} text - 要截断的文本内容
 * @param {number} [maxLength=20] - 允许的最大字符长度，必须大于0
 * @returns {TruncateTextResult} 包含截断结果、是否截断标志和原始字符串的对象
 * @throws {Error} 当maxLength不是正整数时抛出错误
 */
export function truncateText(
	text: TextInput,
	maxLength: number = DEFAULT_MAX_LENGTH,
): TruncateTextResult {
	// maxLength 验证：只要求是正整数
	if (typeof maxLength !== 'number' || !Number.isInteger(maxLength) || maxLength <= 0) {
		throw new Error('maxLength must be a positive integer');
	}

	// 空值处理：转换为 EMPTY_VALUE
	if (text === null || text === undefined) {
		return {
			truncated: EMPTY_VALUE,
			isTruncated: false,
			original: EMPTY_VALUE,
		};
	}

	// 转换为字符串
	let textString: string;

	if (typeof text === 'boolean') {
		textString = text.toString(); // true -> "true", false -> "false"
	} else if (typeof text === 'object') {
		try {
			// 尝试 JSON.stringify，如果失败则使用 toString
			textString = JSON.stringify(text);
		} catch {
			textString = String(text);
		}
	} else {
		textString = String(text);
	}

	// 处理空白字符
	textString = textString.trim();

	// trim 后的空字符串处理
	if (!textString) {
		return {
			truncated: EMPTY_VALUE,
			isTruncated: false,
			original: EMPTY_VALUE,
		};
	}

	// 如果长度在限制内，直接返回
	if (textString.length <= maxLength) {
		return {
			truncated: textString,
			isTruncated: false,
			original: textString,
		};
	}

	// 如果 maxLength 太小无法进行有意义的截断，直接截取前 maxLength 个字符
	if (maxLength < MIN_TRUNCATE_LENGTH) {
		return {
			truncated: textString.slice(0, maxLength),
			isTruncated: true,
			original: textString,
		};
	}

	// 计算前后保留的字符数
	const frontLength = Math.floor((maxLength - ELLIPSIS_LENGTH) / 2);
	const backLength = maxLength - ELLIPSIS_LENGTH - frontLength;

	// 安全截取前后部分，避免在特殊字符中间截断
	const front = safeTruncate(textString, frontLength, 'start');
	const back = safeTruncate(textString, backLength, 'end');

	return {
		truncated: `${front}${ELLIPSIS}${back}`,
		isTruncated: true,
		original: textString,
	};
}

/**
 * 安全截取字符串，避免在emoji或特殊字符中间截断
 * @param text 要截取的文本
 * @param length 目标长度
 * @param direction 截取方向
 * @returns 安全截取后的字符串
 */
function safeTruncate(text: string, length: number, direction: 'start' | 'end'): string {
	if (length <= 0) return '';
	if (length >= text.length) return direction === 'start' ? text : text;

	let result: string;

	if (direction === 'start') {
		// 从开头截取
		result = text.slice(0, length);

		// 检查是否在代理对中间截断了
		if (length < text.length && isHighSurrogate(text.charCodeAt(length - 1))) {
			// 如果最后一个字符是高代理字符，需要移除它
			result = result.slice(0, -1);
		}
	} else {
		// 从末尾截取
		const startPos = text.length - length;
		result = text.slice(startPos);

		// 检查是否在代理对中间截断了
		if (startPos > 0 && isLowSurrogate(text.charCodeAt(startPos))) {
			// 如果第一个字符是低代理字符，需要移除它
			result = result.slice(1);
		}
	}

	return result;
}

/**
 * 检查字符代码是否为高代理字符 (emoji等的第一部分)
 */
function isHighSurrogate(charCode: number): boolean {
	return charCode >= 0xd800 && charCode <= 0xdbff;
}

/**
 * 检查字符代码是否为低代理字符 (emoji等的第二部分)
 */
function isLowSurrogate(charCode: number): boolean {
	return charCode >= 0xdc00 && charCode <= 0xdfff;
}

export default truncateText;
