import { hapticFeedback } from '@telegram-apps/sdk';
import { Settings, X } from 'lucide-react';
import type { FC } from 'react';
import { toast } from 'sonner';

import { SafeAreaSpacer } from '@/components/layout/safe-area-spacer';
import { Button } from '@/components/shadcn-ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/shadcn-ui/drawer';

interface MenuDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const MenuDrawer: FC<MenuDrawerProps> = ({ open, onOpenChange }) => {
	// 设置按钮点击处理
	const handleSettingsClick = () => {
		// 触觉反馈
		try {
			hapticFeedback.impactOccurred('light');
		} catch (error) {
			console.warn('Haptic feedback failed:', error);
		}

		toast.info('Coming soon!');
		onOpenChange(false);
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="right">
			<DrawerContent className="min-w-40 max-w-52 w-auto">
				<SafeAreaSpacer position="top" />
				<DrawerHeader className="border-b border-border">
					<div className="flex items-center justify-between">
						<DrawerTitle>Menu</DrawerTitle>
						<DrawerClose asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								aria-label="Close menu"
							>
								<X className="h-4 w-4" />
							</Button>
						</DrawerClose>
					</div>
				</DrawerHeader>

				{/* 菜单内容 */}
				<div className="flex-1 p-4">
					<div className="space-y-2">
						{/* 菜单项 */}
						<div className="space-y-1">
							{/* 设置 */}
							<Button
								variant="ghost"
								className="w-full justify-start"
								size="sm"
								onClick={handleSettingsClick}
							>
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</Button>
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
