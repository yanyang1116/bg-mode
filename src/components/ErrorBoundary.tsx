/**
 * @file
 * 这是一个简洁的错误边界实现
 */
import {
	Component,
	type ComponentType,
	type GetDerivedStateFromError,
	type PropsWithChildren,
	type ReactNode,
} from 'react';

export interface ErrorBoundaryProps extends PropsWithChildren {
	fallback?: ReactNode | ComponentType<{ error: unknown }>;
}

interface ErrorBoundaryState {
	error?: unknown;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	override state: ErrorBoundaryState = {};

	static getDerivedStateFromError: GetDerivedStateFromError<
		ErrorBoundaryProps,
		ErrorBoundaryState
	> = (error) => ({ error });

	override componentDidCatch(error: Error) {
		this.setState({ error }); // 此行其实不需要，但是保留
		// TODO，可以做渲染 error 上报
	}

	override render() {
		const {
			state: { error },
			props: { fallback: Fallback, children },
		} = this;

		return 'error' in this.state ? (
			typeof Fallback === 'function' ? (
				<Fallback error={error} />
			) : (
				Fallback
			)
		) : (
			children
		);
	}
}
