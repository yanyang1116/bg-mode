import type { TabItem } from './types';

// 根据当前路径获取激活的tab
export const getActiveTabId = (pathname: string, tabs: TabItem[]): string => {
	const matchedTab = tabs.find((tab) => pathname.startsWith(tab.path));
	return matchedTab?.id || 'market';
};

// 获取图标样式类名
export const getIconClassName = (isActive: boolean): string => {
	return `w-4 h-4 mb-0 transition-all duration-300 ease-out ${
		isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
	}`;
};

// 获取文字样式类名
export const getTextClassName = (isActive: boolean): string => {
	return `text-xs transition-all duration-300 ease-out ${
		isActive ? 'font-semibold text-primary' : 'text-muted-foreground'
	}`;
};
