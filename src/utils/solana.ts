/**
 * @file
 * Solana 相关工具函数
 * 提取到这个位置是合理的
 */
import { PublicKey } from '@solana/web3.js';

/**
 * 验证 Solana 地址格式是否有效
 * 使用 @solana/web3.js 的 PublicKey 构造函数进行准确验证
 * @param address - 要验证的地址字符串
 * @returns 地址是否有效
 */
export const isValidSolanaAddress = (address: string): boolean => {
	if (!address || typeof address !== 'string') {
		return false;
	}

	try {
		// 使用 PublicKey 构造函数验证地址
		// 如果地址无效，会抛出异常
		new PublicKey(address);
		return true;
	} catch {
		// 地址格式无效
		return false;
	}
};
