import { hapticFeedback } from '@telegram-apps/sdk';
import { Menu, Search } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { MenuDrawer } from '@/components/layout/menu-drawer';
import { Button } from '@/components/shadcn-ui/button';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { formatNumber } from '@/utils/format-number';
import publicUrl from '@/utils/public-url';

export function Header() {
	const { currentWallet } = useWalletStore();
	const { avatar } = useUserStore();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [drawerInteractive, setDrawerInteractive] = useState(false);

	// 安全的触觉反馈函数
	const triggerHapticFeedback = useCallback(() => {
		try {
			hapticFeedback.impactOccurred('light');
		} catch (error) {
			console.warn('Haptic feedback failed:', error);
		}
	}, []);

	// 搜索按钮点击处理
	const handleSearchClick = useCallback(() => {
		triggerHapticFeedback();
		toast.info('Coming soon!');
	}, [triggerHapticFeedback]);

	// 菜单按钮点击处理
	const handleMenuClick = useCallback(() => {
		triggerHapticFeedback();
		setIsMenuOpen(true);
		setDrawerInteractive(false);

		// 延迟启用交互，等动画完成
		setTimeout(() => {
			setDrawerInteractive(true);
		}, 180);
	}, [triggerHapticFeedback]);

	return (
		<header className="bg-background border-b border-border px-4 py-2">
			<div className="flex items-center justify-between">
				{/* 左侧：头像 + 钱包信息 */}
				<div className="flex items-center space-x-2">
					{/* <img
						src={avatar ?? publicUrl('default-avatar.jpg')}
						alt="User avatar"
						className="w-8 h-8 rounded-full object-cover"
					/> */}

					{/* 钱包信息 */}
					<div className="flex flex-col">
						<div>
							<span className="text-xs text-muted-foreground">
								{currentWallet?.name ?? '-'}
							</span>
						</div>
						<div className="flex items-end space-x-1">
							<span className="text-sm font-bold text-foreground">
								{formatNumber(currentWallet?.totalBalanceInSOL, 'price')}
							</span>
							<span className="text-[10px] text-muted-foreground">SOL</span>
						</div>
					</div>
				</div>

				{/* 右侧：搜索框 + 功能按钮 */}
				<div className="flex items-center space-x-3">
					{/* 搜索按钮 */}
					<Button
						variant="ghost"
						size="icon"
						className="h-12 w-12"
						onClick={handleSearchClick}
						aria-label="Search tokens and markets"
					>
						<Search className="h-6 w-6 text-muted-foreground" />
					</Button>

					{/* 功能按钮 */}
					<Button
						variant="ghost"
						size="icon"
						className="h-12 w-12"
						onClick={handleMenuClick}
						aria-label="Open menu with settings and options"
					>
						<Menu className="h-6 w-6 text-muted-foreground" />
					</Button>
				</div>
			</div>

			{/* 菜单抽屉 */}
			<MenuDrawer
				open={isMenuOpen}
				onOpenChange={drawerInteractive ? setIsMenuOpen : () => {}}
			/>
		</header>
	);
}
