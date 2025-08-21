/**
 * @file
 * ai 实现的
 * 最好也让 ai 改
 */
import Big from 'big.js';

// 常量定义
const SUBSCRIPT_THRESHOLD = 9;

// compact 模式单位定义
const COMPACT_UNITS = [
	{ value: new Big('1000000000000'), symbol: 'T' }, // Trillion
	{ value: new Big('1000000000'), symbol: 'B' }, // Billion
	{ value: new Big('1000000'), symbol: 'M' }, // Million
	{ value: new Big('1000'), symbol: 'K' }, // Thousand
];

// 数字到下标字符的映射表
const SUBSCRIPT_MAP: Record<string, string> = {
	'0': '₀',
	'1': '₁',
	'2': '₂',
	'3': '₃',
	'4': '₄',
	'5': '₅',
	'6': '₆',
	'7': '₇',
	'8': '₈',
	'9': '₉',
};

type FormatNumberInput = number | string | null | undefined;
type FormatNumberType = 'price' | 'compact' | 'percent';

// 去除数字字符串末尾的零
function removeTrailingZeros(numStr: string): string {
	if (numStr.includes('.')) {
		return numStr.replace(/\.?0+$/, '');
	}
	return numStr;
}

/**
 * 格式化数字显示
 * @param value 要格式化的值
 * @param type 格式化类型，默认为 'price'
 * @returns 格式化后的结果
 */
export function formatNumber(value: FormatNumberInput, type: FormatNumberType = 'price'): string {
	// 处理 null 和 undefined
	if (value === null || value === undefined) {
		return '-';
	}

	let bigNum: Big;

	try {
		// 使用 Big.js 处理精度问题
		bigNum = new Big(value);
	} catch (error) {
		console.error('formatNumber: 无法转换为有效数字', value, error);
		return '-';
	}

	// percent 模式处理
	if (type === 'percent') {
		// 乘以100，保留2位小数，截断
		const percentValue = bigNum.times(100);
		const truncated = percentValue.round(2, 0); // 截断保留2位小数

		return removeTrailingZeros(truncated.toString());
	}

	// compact 模式处理
	if (type === 'compact') {
		const absNum = bigNum.abs();

		// 查找合适的单位
		for (const unit of COMPACT_UNITS) {
			if (absNum.gte(unit.value)) {
				const compactValue = bigNum.div(unit.value);
				const truncated = compactValue.round(2, 0); // 截断保留2位小数

				const result = removeTrailingZeros(truncated.toString());
				return `${result}${unit.symbol}`;
			}
		}

		// 小于1000的数字直接返回
		return bigNum.toString();
	}

	// price 模式处理（原有逻辑）
	// 检查是否需要下标显示
	const numStr = bigNum.toString();
	const decimalIndex = numStr.indexOf('.');

	if (decimalIndex !== -1) {
		const decimalPart = numStr.slice(decimalIndex + 1);

		// 规则1: 小数位数必须达到9位（大于8位）
		if (decimalPart.length >= SUBSCRIPT_THRESHOLD) {
			// 规则2: 检查小数点后是否紧跟着连续大于2个0（即3个0或更多）
			let consecutiveZeros = 0;
			for (let i = 0; i < decimalPart.length; i++) {
				if (decimalPart[i] === '0') {
					consecutiveZeros++;
				} else {
					break;
				}
			}

			// 规则3: 只有当连续0大于等于3个时才处理
			if (consecutiveZeros >= 3) {
				const integerPart = numStr.slice(0, decimalIndex);
				const nonZeroPart = decimalPart.slice(consecutiveZeros);

				// 将连续0的数量转换为下标字符
				const subscriptNumber = consecutiveZeros
					.toString()
					.split('')
					.map((digit) => SUBSCRIPT_MAP[digit])
					.join('');

				const result = `${integerPart}.0${subscriptNumber}${nonZeroPart}`;
				return result;
			}
		}
	}

	// 应用千分位分隔符
	const parts = bigNum.toString().split('.');
	parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return parts.join('.');
}

export default formatNumber;
