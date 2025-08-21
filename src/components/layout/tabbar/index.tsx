import { hapticFeedback } from '@telegram-apps/sdk';
import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/shadcn-ui/button';

import { ANIMATION_CONFIG, TABS } from './const';
import { getActiveTabId, getIconClassName, getTextClassName } from './helper';

export function Tabbar() {
	const location = useLocation();
	const navigate = useNavigate();

	// 缓存激活的tab计算结果
	const activeTabId = useMemo(() => getActiveTabId(location.pathname, TABS), [location.pathname]);

	// 缓存点击处理函数
	const handleTabClick = useCallback(
		(tabId: string) => {
			// 触觉反馈
			hapticFeedback.impactOccurred('light');

			const tab = TABS.find((t) => t.id === tabId);
			if (tab) {
				navigate(tab.path);
			}
		},
		[navigate],
	);

	return (
		<div className="bg-background border-t border-border">
			<div className="flex relative">
				{TABS.map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTabId === tab.id;

					return (
						<Button
							key={tab.id}
							variant="ghost"
							className="flex-1 flex-col h-auto py-2 px-2 relative"
							onClick={() => handleTabClick(tab.id)}
						>
							<Icon className={getIconClassName(isActive)} />
							<span className={getTextClassName(isActive)}>{tab.label}</span>

							{isActive && (
								<motion.div
									layoutId="activeIndicator"
									className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
									transition={ANIMATION_CONFIG.SPRING}
								/>
							)}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
