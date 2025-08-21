import { Component, type ErrorInfo, type ReactNode } from 'react';

import { QR_CODE } from './const';

interface QRCodeErrorBoundaryProps {
	children: ReactNode;
}

interface QRCodeErrorBoundaryState {
	hasError: boolean;
}

export class QRCodeErrorBoundary extends Component<
	QRCodeErrorBoundaryProps,
	QRCodeErrorBoundaryState
> {
	constructor(props: QRCodeErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): QRCodeErrorBoundaryState {
		// 更新状态以便下一次渲染能够显示降级后的 UI
		return { hasError: true };
	}

	override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// 记录错误信息到控制台
		console.error('QR 码渲染失败:', error, errorInfo);
	}

	override render() {
		if (this.state.hasError) {
			// 渲染降级 UI - 显示红色的 Error 文字
			return (
				<div className="flex-center bg-muted/20 rounded-lg w-32 h-32">
					<div className="text-sm font-medium text-destructive text-center">
						{QR_CODE.RENDER_ERROR_TEXT}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
