import { TruncatedDisplay } from '@/pages/wallet/components/truncated-display';
import { formatNumber } from '@/utils/format-number';
import { truncateNumber } from '@/utils/truncate-number';

// 渲染资产值的辅助函数
export const renderAssetValue = (
	value: string | undefined | null,
	isVisible: boolean,
	prefix = '',
	hiddenText = '****',
) => {
	if (!isVisible) {
		return hiddenText;
	}

	if (!value) {
		return `${prefix}0`;
	}

	const formatted = formatNumber(value, 'price');
	const result = truncateNumber(formatted);

	if (result.isTruncated) {
		return (
			<TruncatedDisplay originalText={`${prefix}${result.original}`}>
				{prefix}
				{result.truncated}
			</TruncatedDisplay>
		);
	}

	return `${prefix}${result.truncated}`;
};
