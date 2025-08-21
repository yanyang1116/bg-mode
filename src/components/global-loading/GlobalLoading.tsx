import type { FC } from 'react';
import { useRef } from 'react';

import { Dialog, DialogContent } from '@/components/shadcn-ui/dialog';
import { Spinner } from '@/components/shadcn-ui/spinner';
import { useGlobalStore } from '@/store';

export const GlobalLoading: FC = () => {
	const { loading } = useGlobalStore();
	const { isLoading, loadingText } = loading;
	const lastLoadingTextRef = useRef<string>('');

	// 保持最后一次的 loadingText 直到 Dialog 完全关闭
	if (loadingText) {
		lastLoadingTextRef.current = loadingText;
	}

	return (
		<Dialog open={isLoading}>
			<DialogContent
				className="max-w-none w-screen h-screen border-0 p-0 bg-transparent shadow-none"
				showCloseButton={false}
			>
				<div className="flex-center h-full flex-col space-y-4">
					<Spinner size="large" />
					{lastLoadingTextRef.current && (
						<p className="text-sm text-primary">{lastLoadingTextRef.current}</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
