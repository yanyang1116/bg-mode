import { hapticFeedback } from '@telegram-apps/sdk';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';

interface CopyOptions {
	successMessage?: string;
	errorMessage?: string;
	showToast?: boolean;
}

/**
 * 触觉反馈辅助函数
 * @param type 反馈类型
 */
const triggerHapticFeedback = (type: 'success' | 'error'): void => {
	try {
		hapticFeedback.notificationOccurred(type);
	} catch (error) {
		// 静默处理触觉反馈错误，不影响复制功能
		console.warn('Haptic feedback failed:', error);
	}
};

/**
 * 复制文本到剪贴板的统一工具函数
 * @param text 要复制的文本
 * @param options 配置选项
 * @returns 复制是否成功
 */
export const copyToClipboard = (text: string, options: CopyOptions = {}): boolean => {
	const {
		successMessage = 'Copied to clipboard',
		errorMessage = 'Failed to copy to clipboard',
		showToast = true,
	} = options;

	try {
		if (!text || !text.trim()) {
			if (showToast) {
				toast.error('No content to copy');
			}
			triggerHapticFeedback('error');
			return false;
		}

		const success = copy(text);

		// 添加触觉反馈
		triggerHapticFeedback(success ? 'success' : 'error');

		if (showToast) {
			if (success) {
				toast.success(successMessage);
			} else {
				toast.error(errorMessage);
			}
		}

		return success;
	} catch (error) {
		console.error('Copy operation failed:', error);

		// 添加触觉反馈
		triggerHapticFeedback('error');

		if (showToast) {
			toast.error(errorMessage);
		}
		return false;
	}
};
