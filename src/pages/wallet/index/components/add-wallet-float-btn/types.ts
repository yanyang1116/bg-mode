export interface Position {
	x: number;
	y: number;
}

export interface Props {
	onClick: () => void;
	className?: string;
	style?: React.CSSProperties;
}
