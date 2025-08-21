import Big from 'big.js';
import { z } from 'zod';

import { isValidSolanaAddress } from '@/utils/solana';

import { ERROR_MESSAGES, WITHDRAW_CONSTANTS } from './const';
import type { ValidationResult } from './types';

// 安全的 Big.js 数值处理辅助函数
// 避免在数值转换时抛出异常，提供容错机制
const safeBigNumber = (value: string, fallback: string = '0'): Big | null => {
	try {
		return new Big(value);
	} catch {
		// 当输入无效时，返回fallback值的Big实例，或null
		return fallback ? new Big(fallback) : null;
	}
};

// 错误类型判断辅助函数
export const getErrorType = (error: unknown): string => {
	if (error instanceof TypeError && error.message.includes('fetch')) {
		return ERROR_MESSAGES.NETWORK_ERROR;
	}

	if (error instanceof Error) {
		if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
			return ERROR_MESSAGES.TIMEOUT_ERROR;
		}

		if (error.message.includes('500') || error.message.includes('server')) {
			return ERROR_MESSAGES.SERVER_ERROR;
		}
	}

	return ERROR_MESSAGES.UNKNOWN_ERROR;
};

// 创建表单验证 schema（优化 Big.js 实例创建）
export const createWithdrawFormSchema = (availableAmount: string) => {
	// 预先创建可用金额的 Big 实例，避免重复创建
	const availableBig = safeBigNumber(availableAmount, '0');

	return z.object({
		toAddress: z
			.string()
			.min(1, ERROR_MESSAGES.ADDRESS_REQUIRED)
			.refine((val) => isValidSolanaAddress(val), {
				message: ERROR_MESSAGES.INVALID_ADDRESS,
			}),
		amount: z
			.string()
			.min(1, ERROR_MESSAGES.AMOUNT_REQUIRED)
			.refine((val) => {
				const amountBig = safeBigNumber(val);
				return amountBig ? amountBig.gt(0) : false;
			}, ERROR_MESSAGES.AMOUNT_GREATER_THAN_ZERO)
			.refine((val) => {
				const amountBig = safeBigNumber(val);
				return amountBig && availableBig ? amountBig.lte(availableBig) : false;
			}, ERROR_MESSAGES.INSUFFICIENT_BALANCE),
	});
};

// 过滤非数字输入，确保输入格式正确
export const filterNumericInput = (value: string): string => {
	// 第一步：只保留数字和小数点
	const filtered = value.replace(/[^0-9.]/g, '');

	// 第二步：确保小数点只有一个，多余的小数点会被合并
	const parts = filtered.split('.');
	if (parts.length > 2) {
		return parts[0] + '.' + parts.slice(1).join('');
	}

	// 第三步：处理前导零的情况
	// 不允许 "01", "001" 这样的格式，但允许 "0.1"
	if (filtered.match(WITHDRAW_CONSTANTS.VALIDATION.LEADING_ZEROS_PATTERN)) {
		return filtered.replace(WITHDRAW_CONSTANTS.VALIDATION.LEADING_ZEROS_REPLACEMENT, '0');
	}

	return filtered;
};

// 验证路由参数的完整性和格式正确性
export const validateWithdrawParams = (params: {
	fromAddress: string | null;
	walletName: string | null;
	tokenName: string | null;
	tokenAddress: string | null;
	chain: string | null;
	availableAmount?: string | null; // 可选参数
}): ValidationResult => {
	const { fromAddress, walletName, tokenName, tokenAddress, chain } = params;

	// 第一层验证：检查必需参数是否存在
	// 这5个参数对于提现功能是必需的
	const missingParams = [];
	if (!fromAddress) missingParams.push('fromAddress');
	if (!walletName) missingParams.push('walletName');
	if (!tokenName) missingParams.push('tokenName');
	if (!tokenAddress) missingParams.push('tokenAddress');
	if (!chain) missingParams.push('chain');

	// 第二层验证：检查 Solana 地址格式的有效性
	// fromAddress 必须是有效的 Solana 地址
	const isAddressValid = fromAddress ? isValidSolanaAddress(fromAddress) : false;

	// tokenAddress 可以是 'native'（表示 SOL）或有效的 Solana 地址
	const isTokenAddressValid = tokenAddress ? isValidSolanaAddress(tokenAddress) : false;

	return {
		isValid: missingParams.length === 0 && isAddressValid && isTokenAddressValid,
		missingParams,
		isAddressValid,
		isTokenAddressValid,
	};
};

// 安全解析可用金额（非必需参数）
// 确保即使传入无效值也能返回合理的默认值
export const parseAvailableAmount = (availableAmount: string | null): string => {
	if (!availableAmount) return '0';

	const parsed = safeBigNumber(availableAmount, '0');
	return parsed ? parsed.toString() : '0';
};
