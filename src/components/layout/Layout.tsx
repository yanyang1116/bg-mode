import { useRequest } from 'ahooks';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useImmer } from 'use-immer';

import { walletList } from '@/api/user/';
import { FloatingWalletGuide } from '@/components/floating-wallet-guide';
import { PageBack } from '@/components/PageBack';
import { WalletGeneratorModal } from '@/components/wallet-generator';
import { useGlobalStore } from '@/store/global';
import { useWalletStore } from '@/store/wallet';

import { Header } from './header';
import { SafeAreaSpacer } from './safe-area-spacer';
import { Tabbar } from './tabbar';

export function Layout() {
	const [walletModalOpen, setWalletModalOpen] = useImmer(false);
	const { guideGenerateWalletVisible, setGuideGenerateWalletVisible } = useGlobalStore();
	const { setCurrentWallet } = useWalletStore();
	const location = useLocation();
	const navigate = useNavigate();

	// 判断是否为 wallet 路由
	const isWalletRoute = location.pathname.startsWith('/wallet');
	const { runAsync } = useRequest(walletList, {
		manual: true,
	});

	useEffect(() => {
		runAsync({ chain: 'solana' }).then((res) => {
			if (!res?.wallets?.length) {
				setGuideGenerateWalletVisible(true);
				return;
			}
			const defaultWallet = res.wallets.find((wallet) => wallet?.primary);
			if (defaultWallet) setCurrentWallet(defaultWallet);
		});
	}, []);

	return (
		<PageBack>
			<div className="flex flex-col h-screen">
				<SafeAreaSpacer position="top" />

				{!isWalletRoute && <Header />}

				<main className="flex-1 overflow-y-auto">
					<Outlet />
				</main>
				<Tabbar />
				<SafeAreaSpacer position="bottom" />
			</div>
			{guideGenerateWalletVisible && (
				<FloatingWalletGuide onClick={() => setWalletModalOpen(true)} />
			)}
			<WalletGeneratorModal
				open={walletModalOpen}
				onClose={() => setWalletModalOpen(false)}
				onFinish={() => {
					setWalletModalOpen(false);
					toast.success('Success');
					navigate('/wallet');
				}}
			/>
		</PageBack>
	);
}
