import QRCode from 'qrcode';

import { copyToClipboard } from '@/utils/copy-to-clipboard';

import { DEPOSIT_MODAL } from './const';
import type { QRCodeOptions } from './types';

// 处理地址复制功能
export const handleAddressCopy = (address: string) => {
	copyToClipboard(address, {
		successMessage: DEPOSIT_MODAL.COPY_SUCCESS,
		errorMessage: DEPOSIT_MODAL.COPY_ERROR,
	});
};

// 生成二维码数据URL
export const generateQRCode = async (address: string, options?: QRCodeOptions): Promise<string> => {
	try {
		const qrDataURL = await QRCode.toDataURL(address, options);
		return qrDataURL;
	} catch (error) {
		console.error('二维码生成失败:', error);
		throw error;
	}
};
