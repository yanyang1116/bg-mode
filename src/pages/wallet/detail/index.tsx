import { hapticFeedback } from '@telegram-apps/sdk';
import { useRequest } from 'ahooks';
import {
	ArrowDownToLine,
	ArrowUpFromLine,
	Copy,
	Edit2,
	Eye,
	EyeOff,
	RefreshCw,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useImmer } from 'use-immer';

import { walletDetail, walletUpdate } from '@/api/user/';
import { Button } from '@/components/shadcn-ui/button';
import { DepositModal } from '@/pages/wallet/components/deposit-modal';
import { TruncatedDisplay } from '@/pages/wallet/components/truncated-display';
import { useWalletStore } from '@/store/wallet';
import { copyToClipboard } from '@/utils/copy-to-clipboard';
import { formatAddress } from '@/utils/format-address';
import publicUrl from '@/utils/public-url';
import { truncateText } from '@/utils/truncate-text';

import { DetailTokenListItem } from './components/detail-token-list-item';
import { EditNameModal } from './components/edit-name-modal';
import {
	ADDRESS_DISPLAY_LENGTH,
	EMPTY_STATE,
	LOADING_TEXT,
	WALLET_NAME_MAX_DISPLAY_LENGTH,
} from './const';
import { renderAssetValue } from './helper';
import type { WalletDetailParams } from './types';

export function WalletDetail() {
	const { id } = useParams<WalletDetailParams>();
	const navigate = useNavigate();
	const [uiState, setUiState] = useImmer({
		isAssetsVisible: true,
		isDepositModalOpen: false,
		depositModalData: null as { address: string; name: string } | null,
		isEditNameModalOpen: false,
	});

	// 获取钱包详情数据
	const address = id ? decodeURIComponent(id) : '';

	// 获取当前选中的钱包状态
	const { currentWallet, setCurrentWallet } = useWalletStore();

	const {
		data: walletData,
		loading,
		refresh: refreshWallets,
		mutate,
	} = useRequest(() => walletDetail({ address, chain: 'solana' }), {
		onSuccess: (freshWalletData) => {
			// 如果刷新的钱包是全局选中的钱包，同步更新 store 状态
			if (freshWalletData && currentWallet && currentWallet.address === address) {
				setCurrentWallet(freshWalletData);
			}
		},
	});

	// 处理保存钱包名称
	const { runAsync: updateWalletName } = useRequest(
		(newName: string) =>
			walletUpdate({
				chain: 'solana',
				address,
				name: newName,
			}),
		{
			manual: true,
			onSuccess: (walletListData) => {
				// API 返回的是全量钱包列表，需要找到当前钱包
				if (walletListData?.wallets) {
					const updatedCurrentWallet = walletListData.wallets.find(
						(wallet) => wallet?.address === address,
					);

					if (updatedCurrentWallet) {
						// 更新当前页面的钱包数据
						mutate(updatedCurrentWallet);

						// 如果当前钱包是全局选中的钱包，同时更新 store 状态
						if (currentWallet && currentWallet.address === address) {
							setCurrentWallet(updatedCurrentWallet);
						}
					}
				}
			},
		},
	);

	const toggleAssetsVisibility = () => {
		setUiState((draft) => {
			draft.isAssetsVisible = !draft.isAssetsVisible;
		});
	};

	const handleCopyAddress = () => {
		copyToClipboard(address, {
			successMessage: 'Address copied to clipboard',
			errorMessage: 'Failed to copy address',
		});
	};

	// 处理单个 token 充值
	const handleTokenDeposit = (_: unknown, tokenName: string) => {
		setUiState((draft) => {
			draft.depositModalData = { address, name: tokenName };
			draft.isDepositModalOpen = true;
		});
	};

	// 处理 SOL 充值（钱包主充值按钮）
	const handleSOLDeposit = () => {
		setUiState((draft) => {
			draft.depositModalData = { address, name: 'Solana' };
			draft.isDepositModalOpen = true;
		});
	};

	// 处理 SOL 提现
	const handleSOLWithdraw = () => {
		const params = new URLSearchParams({
			fromAddress: address,
			chain: 'solana',
			tokenName: 'Solana',
			tokenAddress: 'So11111111111111111111111111111111111111111', // SOL 的特殊标识
			walletName: walletData?.name || '',
			availableAmount: walletData?.totalBalanceInSOL || '0',
			tokenImg: publicUrl('/solana.svg'), // SOL 图标
		});
		navigate(`/wallet/withdraw?${params.toString()}`);
	};

	// 关闭充值弹窗
	const handleCloseDepositModal = () => {
		setUiState((draft) => {
			draft.isDepositModalOpen = false;
			draft.depositModalData = null;
		});
	};

	// 处理编辑钱包名称
	const handleEditWalletName = () => {
		setUiState((draft) => {
			draft.isEditNameModalOpen = true;
		});
	};

	const handleSaveWalletName = async (newName: string) => {
		await updateWalletName(newName);
	};

	// 处理提现跳转
	const handleTokenWithdraw = (tokenAddress: string, tokenName: string) => {
		// 从 tokens 数组中找到对应的 token 来获取可用金额
		const token = walletData?.tokens?.find((t) => t?.address === tokenAddress);
		const availableAmount = token?.amount || '0';
		const tokenImg = token?.imageUrl || publicUrl('/default-token.svg');

		const params = new URLSearchParams({
			fromAddress: address,
			chain: 'solana',
			tokenName,
			tokenAddress,
			walletName: walletData?.name || '',
			availableAmount,
			tokenImg,
		});
		navigate(`/wallet/withdraw?${params.toString()}`);
	};

	// 处理刷新钱包数据
	const handleRefreshWallet = async () => {
		try {
			hapticFeedback.impactOccurred('light');
		} catch (error) {
			console.warn('Haptic feedback failed:', error);
		}
		refreshWallets();
	};

	return (
		<div className="bg-background text-foreground">
			{/* 钱包标题区域 + 总资产区域 - 使用 sticky 固定 */}
			<div className="bg-background sticky top-0 z-10">
				{/* 钱包标题区域 */}
				<div className="px-4 pt-4">
					<div className="mb-4">
						<div className="flex items-end gap-1 mb-1">
							{(() => {
								const walletName = walletData?.name || 'Wallet';
								const isNameTooLong =
									walletName.length > WALLET_NAME_MAX_DISPLAY_LENGTH;

								if (isNameTooLong) {
									return (
										<TruncatedDisplay
											originalText={walletName}
											className="text-2xl font-bold leading-none"
										>
											{truncateText(walletName).truncated}
										</TruncatedDisplay>
									);
								}

								return (
									<h1 className="text-2xl font-bold leading-none max-w-[17rem] truncate whitespace-nowrap overflow-hidden">
										{walletName}
									</h1>
								);
							})()}
							<Button
								variant="ghost"
								size="sm"
								onClick={handleEditWalletName}
								className="p-0.5 h-auto w-auto opacity-60 hover:opacity-100"
								aria-label="Edit wallet name"
							>
								<Edit2 className="w-4 h-4 text-muted-foreground" />
							</Button>
						</div>
						<div className="flex items-center mt-1">
							<p className="text-sm text-muted-foreground font-mono mr-1">
								{formatAddress(address, ADDRESS_DISPLAY_LENGTH)}
							</p>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleCopyAddress}
								className="p-1 h-auto w-auto opacity-60 hover:opacity-100"
								aria-label={`Copy wallet address ${formatAddress(address, ADDRESS_DISPLAY_LENGTH)}`}
							>
								<Copy className="w-4 h-4 text-muted-foreground" />
							</Button>
						</div>
					</div>
				</div>

				{/* 总资产区域 */}
				<div className="px-4 py-3 border-b border-border">
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm text-muted-foreground">Total Assets</span>
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleAssetsVisibility}
								aria-label={
									uiState.isAssetsVisible
										? 'Hide asset values'
										: 'Show asset values'
								}
							>
								{uiState.isAssetsVisible ? (
									<Eye className="w-6 h-6 text-muted-foreground" />
								) : (
									<EyeOff className="w-6 h-6 text-muted-foreground" />
								)}
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleRefreshWallet}
								aria-label="Refresh wallet data"
								disabled={loading}
							>
								<RefreshCw
									className={`w-6 h-6 text-primary hover:text-primary/80 transition-colors ${loading ? 'animate-spin' : ''}`}
								/>
							</Button>
						</div>
					</div>

					<div className="flex items-end justify-between">
						<div className="text-xl font-bold leading-none">
							{renderAssetValue(
								walletData?.totalBalanceInUSDC,
								uiState.isAssetsVisible,
								'$',
								'$****',
							)}
						</div>
						<div className="flex items-end gap-1">
							<div className="text-lg font-semibold leading-none">
								{renderAssetValue(
									walletData?.totalBalanceInSOL,
									uiState.isAssetsVisible,
									'',
									'****',
								)}
							</div>
							<div className="text-sm text-muted-foreground leading-none">SOL</div>
						</div>
					</div>

					{/* 充值和提现按钮 */}
					<div className="mt-4 flex gap-3">
						<Button
							onClick={handleSOLWithdraw}
							variant="outline"
							className="flex-1 font-semibold"
						>
							<ArrowUpFromLine className="w-4 h-4 mr-1" />
							Withdraw SOL
						</Button>
						<Button onClick={handleSOLDeposit} className="flex-1 font-semibold">
							<ArrowDownToLine className="w-4 h-4 mr-1" />
							Deposit SOL
						</Button>
					</div>
				</div>

				{/* 持有代币标题 */}
				<div className="px-4 py-3 border-b border-border mt-3">
					<h2 className="text-base font-semibold text-foreground">Token Holdings</h2>
				</div>
			</div>

			{/* Token列表区域 - 可滚动 */}
			<div className="px-4">
				{loading ? (
					<div className="text-center py-8 text-muted-foreground">
						<p>{LOADING_TEXT.TOKENS}</p>
						<p className="text-sm mt-1">{LOADING_TEXT.DESCRIPTION}</p>
					</div>
				) : !walletData?.tokens || walletData.tokens.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<p>{EMPTY_STATE.NO_TOKENS}</p>
						<p className="text-sm mt-1">{EMPTY_STATE.DESCRIPTION}</p>
					</div>
				) : (
					<div>
						{walletData.tokens.map((token, index) => (
							<DetailTokenListItem
								key={token?.address ?? index}
								{...{ token, index, isAssetsVisible: uiState.isAssetsVisible }}
								onDepositClick={handleTokenDeposit}
								onWithdrawClick={handleTokenWithdraw}
							/>
						))}
					</div>
				)}
			</div>

			{/* 充值弹窗 */}
			<DepositModal
				isOpen={uiState.isDepositModalOpen}
				onClose={handleCloseDepositModal}
				walletAddress={uiState.depositModalData?.address ?? ''}
				walletName={walletData?.name ?? '-'}
				tokenName={uiState.depositModalData?.name ?? '-'}
			/>

			{/* 编辑名称弹窗 */}
			<EditNameModal
				isOpen={uiState.isEditNameModalOpen}
				onClose={() =>
					setUiState((draft) => {
						draft.isEditNameModalOpen = false;
					})
				}
				currentName={walletData?.name || 'Wallet'}
				onSave={handleSaveWalletName}
			/>
		</div>
	);
}
