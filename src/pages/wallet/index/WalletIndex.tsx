import { hapticFeedback } from '@telegram-apps/sdk';
import { useRequest } from 'ahooks';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useImmer } from 'use-immer';

import { walletList, walletSetPrimary } from '@/api/user/';
import { Button } from '@/components/shadcn-ui/button';
import { RadioGroup } from '@/components/shadcn-ui/radio-group';
import { WalletGeneratorModal } from '@/components/wallet-generator';
import { useWalletStore } from '@/store/wallet';
import publicUrl from '@/utils/public-url';

import { AddWalletFloatBtn } from './components/add-wallet-float-btn';
import { OverviewWalletCard } from './components/overview-wallet-card';
import { EMPTY_STATE, ERROR_MESSAGES, LOADING_TEXT, PAGE_TEXTS } from './const';
import { formatTotalBalance, getBalanceTextSize, transformWalletData } from './helper';
import type { WalletData } from './types';

export function WalletIndex() {
	const [addWalletModalOpen, setAddWalletModalOpen] = useImmer(false);
	const navigate = useNavigate();
	const [isAssetsVisible, setIsAssetsVisible] = useImmer(true);
	const [wallets, setWallets] = useImmer<WalletData[]>([]);
	const [originalWallets, setOriginalWallets] = useImmer<Wallet.WalletItem[]>([]); // 保存原始API数据
	const [isChangingWallet, setIsChangingWallet] = useState(false);
	const [totalSolBalance, setTotalSolBalance] = useImmer('-');
	const [totalUsdValue, setTotalUsdValue] = useImmer('-');
	const { currentWallet, setCurrentWallet } = useWalletStore();
	const { refresh: refreshWallets, loading } = useRequest(() => walletList({ chain: 'solana' }), {
		onSuccess: (res) => {
			// 保存原始API数据
			setOriginalWallets((res?.wallets ?? []) as Wallet.WalletItem[]);

			// 转换API数据结构为前端WalletData格式
			const transformedWallets = transformWalletData(res?.wallets);

			// 更新状态
			setWallets(transformedWallets);
			setTotalSolBalance(formatTotalBalance(res?.totalBalanceInSOL));
			setTotalUsdValue(formatTotalBalance(res?.totalBalanceInUSDC));

			// 同步更新store中的当前选中钱包
			// 优先保持当前选中的钱包，如果当前没有选中钱包则使用primary钱包
			let targetWallet: Wallet.WalletItem | null = null;

			if (currentWallet?.address) {
				// 如果store中有当前选中的钱包，从返回数据中找到对应的最新数据
				const foundWallet = res?.wallets?.find(
					(w) => w && w.address === currentWallet.address,
				);
				if (foundWallet) {
					targetWallet = foundWallet as Wallet.WalletItem;
				}
			}

			// 如果没找到当前选中的钱包（可能被删除了），则使用primary钱包
			if (!targetWallet) {
				const primaryWallet = res?.wallets?.find((w) => w?.primary);
				if (primaryWallet) {
					targetWallet = primaryWallet as Wallet.WalletItem;
				}
			}

			setCurrentWallet(targetWallet);
		},
	});

	// 切换资产显示状态
	const toggleAssetsVisibility = () => {
		setIsAssetsVisible(!isAssetsVisible);
	};

	// 跳转到钱包详情页
	const handleWalletCardClick = (wallet: WalletData) => {
		// 使用钱包地址作为路由参数，因为地址是唯一的
		navigate(`/wallet/detail/${encodeURIComponent(wallet.address)}`);
	};

	// 处理刷新钱包数据
	const handleRefreshWallets = async () => {
		try {
			hapticFeedback.impactOccurred('light');
		} catch (error) {
			console.warn('Haptic feedback failed:', error);
		}
		refreshWallets();
	};

	// 切换primary钱包
	const handleWalletChange = async (walletId: string) => {
		try {
			if (!walletId) {
				console.warn(ERROR_MESSAGES.INVALID_WALLET_ADDRESS);
				toast.error(ERROR_MESSAGES.INVALID_WALLET_ADDRESS);
				return;
			}

			setIsChangingWallet(true);

			// 找到要切换的钱包
			const selectedWallet = wallets.find((wallet) => wallet.id.toString() === walletId);
			if (!selectedWallet) {
				console.warn(ERROR_MESSAGES.WALLET_NOT_FOUND, walletId);
				toast.error(ERROR_MESSAGES.WALLET_NOT_FOUND);
				return;
			}

			// 调用API切换主钱包
			await walletSetPrimary({ address: selectedWallet.address, chain: 'solana' });

			// API调用成功后，更新本地状态
			setWallets((draft) => {
				// 先将所有钱包的isPrimary设为false
				draft.forEach((wallet) => {
					wallet.isPrimary = false;
				});
				// 然后将选中的钱包设为primary
				const targetWallet = draft.find((wallet) => wallet.id.toString() === walletId);
				if (targetWallet) {
					targetWallet.isPrimary = true;
				}
			});

			// 同步更新store - 从原始数据中找到对应钱包
			const originalWallet = originalWallets.find(
				(w) => w.address === selectedWallet.address,
			);
			if (originalWallet) {
				// 更新原始数据的primary状态
				setOriginalWallets((draft) => {
					draft.forEach((w) => (w.primary = false));
					const target = draft.find((w) => w.address === selectedWallet.address);
					if (target) target.primary = true;
				});
				// 设置到store
				setCurrentWallet({ ...originalWallet, primary: true });
			}
		} catch (error) {
			console.error('Failed to switch wallet:', error);
			toast.error(ERROR_MESSAGES.SWITCH_WALLET_FAILED);
		} finally {
			setIsChangingWallet(false);
		}
	};

	return (
		<>
			<div className="bg-background text-foreground">
				{/* 总余额显示 + 表头 - 使用 sticky 固定 */}
				<div className="sticky top-0 bg-background z-20 px-4 pt-1 pb-2">
					{/* 总余额显示 */}
					<div>
						{/* 标题和眼睛图标 */}
						<div className="flex items-center justify-between">
							<h2 className="text-xs font-medium text-muted-foreground tracking-wider">
								{PAGE_TEXTS.TOTAL_SOLANA}
							</h2>
							<div className="flex items-center gap-2">
								<Button
									size="icon"
									onClick={toggleAssetsVisibility}
									variant="ghost"
									aria-label={
										isAssetsVisible ? 'Hide asset values' : 'Show asset values'
									}
								>
									{isAssetsVisible ? (
										<Eye className="w-7 h-7 text-muted-foreground" />
									) : (
										<EyeOff className="w-7 h-7 text-muted-foreground" />
									)}
								</Button>
								<Button
									size="icon"
									onClick={handleRefreshWallets}
									variant="ghost"
									aria-label="Refresh wallet data"
									disabled={loading}
								>
									<RefreshCw
										className={`w-7 h-7 text-primary hover:text-primary/80 transition-colors ${loading ? 'animate-spin' : ''}`}
									/>
								</Button>
							</div>
						</div>

						{/* 主余额显示 */}
						<div className="flex items-center gap-3 mb-2">
							<img
								src={publicUrl('solana.svg')}
								alt="Solana"
								width="24"
								height="24"
								className="w-6 h-6"
							/>
							<div className="flex items-end gap-2">
								<span
									className={`font-bold tracking-tighter max-w-[40vw] break-words ${getBalanceTextSize(totalSolBalance)}`}
								>
									{isAssetsVisible ? totalSolBalance : '****'}
								</span>
								<span className="text-2xl text-muted-foreground">/</span>
								<div className="flex flex-col text-xs text-muted-foreground max-w-[30vw]">
									<span className="break-words">
										≈ {isAssetsVisible ? `$${totalUsdValue}` : '$****'}
									</span>
									<span>{PAGE_TEXTS.EQUIV_USD}</span>
								</div>
							</div>
						</div>
					</div>

					{/* 表头 */}
					<div className="flex items-center text-sm font-medium text-muted-foreground border-b border-border pb-2 mt-6">
						<span className="flex-[3]">{PAGE_TEXTS.WALLETS_HEADER}</span>
						<div className="flex-[2] text-right">{PAGE_TEXTS.BALANCE_HEADER}</div>
						<div className="flex-[2] text-right">{PAGE_TEXTS.TOKENS_HEADER}</div>
					</div>
				</div>

				{/* 钱包列表 - 可滚动 */}
				<div className="px-4 pb-4">
					{loading ? (
						<div className="text-center py-8 text-muted-foreground">
							<p>{LOADING_TEXT.WALLETS}</p>
							<p className="text-sm mt-1">{LOADING_TEXT.DESCRIPTION}</p>
						</div>
					) : wallets.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<p>{EMPTY_STATE.NO_WALLETS}</p>
							<p className="text-sm mt-1">{EMPTY_STATE.DESCRIPTION}</p>
						</div>
					) : (
						<RadioGroup
							value={wallets.find((w) => w.isPrimary)?.id.toString()}
							onValueChange={handleWalletChange}
							className={`space-y-2 transition-opacity duration-200 ${isChangingWallet ? 'opacity-70' : 'opacity-100'}`}
						>
							{wallets.map((wallet, index) => (
								<OverviewWalletCard
									key={wallet.id}
									wallet={wallet}
									isVisible={isAssetsVisible}
									index={index}
									onClick={() => handleWalletCardClick(wallet)}
								/>
							))}
						</RadioGroup>
					)}
				</div>
			</div>
			<AddWalletFloatBtn onClick={() => setAddWalletModalOpen(true)} />
			<WalletGeneratorModal
				open={addWalletModalOpen}
				onClose={() => setAddWalletModalOpen(false)}
				onFinish={() => {
					setAddWalletModalOpen(false);
					toast.success('Success');
					refreshWallets();
				}}
			/>
		</>
	);
}
