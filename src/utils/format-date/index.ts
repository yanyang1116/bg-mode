import dayjs from 'dayjs';
import type { ConfigType } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// 扩展 dayjs 功能
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 格式化日期显示
 * @param input dayjs 支持的输入类型，假设后端传入的是 UTC 时间
 * @param format 格式字符串，默认为 'MM/DD HH:mm:ss'
 * @returns 格式化后的日期字符串，转换为本地时区，无效输入返回 '-'
 */
export function formatDate(input: ConfigType, format: string = 'MM/DD HH:mm:ss'): string {
	let date = dayjs(input);

	if (!date.isValid()) {
		console.error('format date: 无法解析日期', input);
		return '-';
	}

	// 如果输入是字符串且包含时间，假设是 UTC 时间并转换为本地时区
	if (typeof input === 'string' && input.includes('T')) {
		date = dayjs.utc(input).local();
	} else {
		// 对于其他类型的输入（时间戳、Date 对象等），直接使用本地时区
		date = dayjs(input);
	}

	return date.format(format);
}

export default formatDate;
