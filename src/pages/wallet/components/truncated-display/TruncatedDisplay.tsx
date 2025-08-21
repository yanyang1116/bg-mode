import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn-ui/popover';

import type { TruncatedDisplayProps } from './types';

export function TruncatedDisplay({
	children,
	originalText,
	className = '',
}: TruncatedDisplayProps) {
	return (
		<Popover modal={true}>
			<PopoverTrigger asChild>
				<button
					className={`hover:bg-muted/20 rounded px-1 transition-colors underline decoration-dotted ${className}`}
					aria-label="Click to view full content"
					aria-describedby="truncated-content"
				>
					{children}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-auto max-w-[80vw]">
				<div className="text-center">
					<div id="truncated-content" className="font-mono text-sm font-bold break-all">
						{originalText}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
