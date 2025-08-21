import type { ReactNode } from 'react';

export interface TruncatedDisplayProps {
	children: ReactNode;
	originalText: string;
	className?: string;
}
