/**
 * 格式化地址，省略中间部分并用省略号替代
 * @param {string} address - 地址字符串
 * @param {number} [totalLength=12] - 保留的总字符数（不包括省略号），必须大于0
 * @returns {string} 格式化后的地址字符串
 * @throws {Error} 当参数类型不正确或totalLength小于等于0时抛出错误
 */
export function formatAddress(address: string, totalLength: number = 12): string {
	// 参数类型验证
	if (typeof address !== 'string') {
		throw new Error('Address must be a string');
	}

	if (typeof totalLength !== 'number' || !Number.isInteger(totalLength) || totalLength <= 0) {
		throw new Error('Total length must be a positive integer');
	}

	// 空字符串处理
	if (!address) {
		return '';
	}

	// 如果地址长度小于等于要求的总长度，直接返回原地址
	if (address.length <= totalLength) {
		return address;
	}

	// 计算前后各保留的字符数
	const halfLength = Math.floor(totalLength / 2);
	const frontChars = halfLength;
	const backChars = totalLength - halfLength;

	// 提取前半部分和后半部分
	const front = address.slice(0, frontChars);
	const back = address.slice(-backChars);

	return `${front}...${back}`;
}

export default formatAddress;
