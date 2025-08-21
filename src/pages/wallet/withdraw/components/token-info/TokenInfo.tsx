import { formatNumber } from '@/utils/format-number';

import { TOKEN_INFO } from './const';
import type { TokenInfoProps } from './types';

export function TokenInfo({ tokenImg, tokenName, walletName, availableAmount }: TokenInfoProps) {
	const displayTokenName = tokenName || TOKEN_INFO.DEFAULT_TOKEN_NAME;
	const displayWalletName = walletName || TOKEN_INFO.DEFAULT_WALLET_NAME;

	return (
		<div
			className="bg-card rounded-lg border border-border p-4"
			role="region"
			aria-label={TOKEN_INFO.INFO_CARD_LABEL}
		>
			{/* Token 信息 */}
			<div className="flex items-start gap-3">
				{tokenImg && tokenImg.trim() && (
					<img
						src={tokenImg}
						alt={displayTokenName}
						className="w-8 h-8 rounded-full flex-shrink-0"
						onError={(e) => {
							e.currentTarget.classList.add('hidden');
						}}
					/>
				)}
				<div className="flex-1 min-w-0" aria-label={TOKEN_INFO.TOKEN_SECTION_LABEL}>
					<h3 className="font-semibold text-foreground mb-1">
						{displayTokenName} {TOKEN_INFO.WITHDRAWAL_SUFFIX}
					</h3>
					<p
						className="text-sm text-muted-foreground leading-relaxed break-all"
						aria-label={TOKEN_INFO.WALLET_SECTION_LABEL}
					>
						{displayWalletName}
					</p>
				</div>
				<div
					className="text-right flex-shrink-0"
					aria-label={TOKEN_INFO.AVAILABLE_AMOUNT_LABEL}
				>
					<p className="text-xs text-muted-foreground">{TOKEN_INFO.AVAILABLE_LABEL}</p>
					<p
						className="font-semibold text-primary"
						aria-label={`${TOKEN_INFO.AVAILABLE_LABEL}: ${formatNumber(availableAmount, 'price')}`}
					>
						{formatNumber(availableAmount, 'price')}
					</p>
				</div>
			</div>
		</div>
	);
}
