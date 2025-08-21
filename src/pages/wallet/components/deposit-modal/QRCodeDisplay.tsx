import { useEffect, useMemo, useState } from 'react';

import { QR_CODE } from './const';
import { generateQRCode } from './helper';
import type { QRCodeDisplayProps } from './types';

export function QRCodeDisplay({ address, size = QR_CODE.SIZE }: QRCodeDisplayProps) {
	const [qrDataURL, setQrDataURL] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string>('');

	// 使用 useMemo 缓存 QR 码生成参数，避免重复计算
	const qrParams = useMemo(
		() => ({
			width: size,
			margin: QR_CODE.MARGIN,
			color: {
				dark: QR_CODE.COLORS.DARK,
				light: QR_CODE.COLORS.LIGHT,
			},
			errorCorrectionLevel: QR_CODE.ERROR_CORRECTION,
		}),
		[size],
	);

	useEffect(() => {
		if (!address) return;

		const generateQR = async () => {
			try {
				setIsLoading(true);
				setError('');
				const dataURL = await generateQRCode(address, qrParams);
				setQrDataURL(dataURL);
			} catch (error) {
				console.error('生成二维码失败:', error);
				setError(QR_CODE.ERROR_TEXT);
			} finally {
				setIsLoading(false);
			}
		};

		generateQR();
	}, [address, qrParams]);

	if (isLoading) {
		return (
			<div
				className="flex-center bg-muted/20 rounded-lg w-32 h-32"
				aria-busy="true"
				aria-live="polite"
			>
				<div className="text-xs text-muted-foreground">{QR_CODE.LOADING_TEXT}</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-center bg-muted/20 rounded-lg w-32 h-32" aria-live="assertive">
				<div className="text-xs text-muted-foreground text-center">
					{QR_CODE.ERROR_TEXT.split(' ').map((word, index) => (
						<span key={index}>
							{word}
							{index === 1 && <br />}
							{index !== QR_CODE.ERROR_TEXT.split(' ').length - 1 &&
								index !== 1 &&
								' '}
						</span>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg p-2 w-32 h-32 flex-center">
			<img src={qrDataURL} alt={QR_CODE.ALT_TEXT} className="w-full h-full object-contain" />
		</div>
	);
}
