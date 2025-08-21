import { useDrag } from '@use-gesture/react';
import { useRequest } from 'ahooks';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

import { walletGenerate } from '@/api/user/';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn-ui/dialog';
import { useGlobalStore } from '@/store';

import { SLIDER_CONFIG, UI_CONFIG } from './const';
import { calculateMaxDrag, resetDragState } from './helper';
import type { DragState, WalletGeneratorModalProps, WalletInfo } from './types';
import WalletResultModal from './WalletResultModal';

const WalletGeneratorModal: FC<WalletGeneratorModalProps> = ({ open, onClose, onFinish }) => {
	const sliderRef = useRef<HTMLDivElement>(null);
	const { setLoading } = useGlobalStore();
	const { runAsync } = useRequest(walletGenerate, {
		manual: true,
	});
	const [dragState, setDragState] = useImmer<DragState>({
		progress: 0,
		maxProgress: SLIDER_CONFIG.INITIAL_MAX_PROGRESS,
		isDragging: false,
		isUnlocked: false,
	});
	const [walletInfo, setWalletInfo] = useImmer<WalletInfo | null>(null);
	const [showWalletResult, setShowWalletResult] = useImmer(false);

	// 动态计算最大拖动距离
	useEffect(() => {
		if (sliderRef.current) {
			const containerWidth = sliderRef.current.offsetWidth;
			const maxDrag = calculateMaxDrag(
				containerWidth,
				SLIDER_CONFIG.SLIDER_SIZE,
				SLIDER_CONFIG.PADDING,
			);

			setDragState((draft) => {
				draft.maxProgress = maxDrag;
			});
		}
	}, [open, setDragState]);

	const bind = useDrag(({ movement: [mx], active, last }) => {
		// 如果已经解锁，直接返回，禁用所有拖动
		if (dragState.isUnlocked) {
			return;
		}

		if (active) {
			// 拖动中，允许拖动但限制在合理范围内
			const clampedProgress = Math.min(Math.max(0, mx), dragState.maxProgress);
			setDragState((draft) => {
				draft.progress = clampedProgress;
				draft.isDragging = true;
			});
		}

		if (last) {
			setDragState((draft) => {
				draft.isDragging = false;
			});

			// 检查是否达到解锁阈值
			const threshold = dragState.maxProgress * SLIDER_CONFIG.UNLOCK_THRESHOLD;
			const finalProgress = Math.min(Math.max(0, mx), dragState.maxProgress);

			if (finalProgress >= threshold) {
				setDragState((draft) => {
					draft.isUnlocked = true;
					draft.progress = dragState.maxProgress; // 固定在最大位置
				});

				// 开始loading，模拟接口调用
				setLoading(true, 'Generating wallet...');
				runAsync({
					chain: 'solana',
				})
					.then((res) => {
						setWalletInfo({
							address: res?.pubkey ?? '',
							privateKey: res?.privateKey ?? '',
						});
						setShowWalletResult(true);
						setLoading(false);
					})
					.catch(() => {
						setLoading(false);
						// 重置拖拽状态到初始状态
						resetDragState(setDragState);
						setWalletInfo(null);
					});
			} else {
				setTimeout(() => {
					setDragState((draft) => {
						draft.progress = 0;
					});
				}, SLIDER_CONFIG.RESET_DELAY);
			}
		}
	});

	const handleWalletResultConfirm = () => {
		// 关闭内部钱包结果弹窗
		setShowWalletResult(false);
		// 重置状态
		resetDragState(setDragState);
		setWalletInfo(null);
		// 通知外部完成流程
		onFinish?.();
	};

	return (
		<>
			<Dialog open={open && !showWalletResult} onOpenChange={(open) => !open && onClose()}>
				<DialogContent
					className="mx-auto bg-[var(--card-bg-light)] border-border"
					onInteractOutside={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle className="text-white text-xl font-semibold text-center">
							GENERATE WALLET
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-6 py-4">
						{/* 描述文字 */}
						<div className="text-center space-y-2">
							<p>🚀 Generate a Solana wallet to start your trading journey!</p>
							<p className="text-muted-foreground text-sm">
								Click and drag the slider below to generate your wallet and get your
								wallet key and address
							</p>
						</div>

						{/* 滑动验证条 */}
						<div>
							{/* 滑动条背景 */}
							<div
								ref={sliderRef}
								className="relative mx-auto shadow-md shadow-card/30"
								style={{
									background: 'linear-gradient(90deg, #22d3ee 0%, #a855f7 100%)',
									width: `${SLIDER_CONFIG.CONTAINER_WIDTH}px`,
									height: `${SLIDER_CONFIG.CONTAINER_HEIGHT}px`,
									borderRadius: `${SLIDER_CONFIG.BORDER_RADIUS}px`,
								}}
							>
								{/* 滑块 */}
								<div
									{...bind()}
									role="slider"
									tabIndex={0}
									aria-label="Drag to generate wallet - slide to unlock wallet generation"
									aria-valuemin={0}
									aria-valuemax={dragState.maxProgress}
									aria-valuenow={dragState.progress}
									aria-valuetext={
										dragState.isUnlocked
											? 'Unlocked'
											: `Progress: ${Math.round((dragState.progress / dragState.maxProgress) * 100)}%`
									}
									className="absolute bg-white rounded-full cursor-grab z-10 shadow-lg border border-gray-300"
									style={{
										top: '4px',
										left: '4px',
										width: `${SLIDER_CONFIG.SLIDER_SIZE}px`,
										height: `${SLIDER_CONFIG.SLIDER_SIZE}px`,
										transform: `translateX(${dragState.progress}px)`,
										transition: dragState.isDragging
											? 'none'
											: 'transform 0.3s ease-out',
									}}
								>
									<div
										className="rounded-full m-auto"
										style={{
											background:
												'linear-gradient(90deg, #22d3ee 0%, #a855f7 100%)',
											width: `${SLIDER_CONFIG.SLIDER_SIZE - 2}px`,
											height: `${SLIDER_CONFIG.SLIDER_SIZE - 2}px`,
										}}
									/>
								</div>

								{/* 背景文字 */}
								<div
									className="absolute inset-0 flex-center text-white text-sm transition-opacity duration-200"
									style={{
										opacity:
											dragState.progress >
											UI_CONFIG.PRIVATE_KEY_REVEAL_THRESHOLD
												? 0
												: 1,
									}}
								>
									Drag to unlock
								</div>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* 钱包结果弹窗 */}
			{walletInfo && (
				<WalletResultModal
					open={showWalletResult}
					onConfirm={handleWalletResultConfirm}
					walletData={walletInfo}
				/>
			)}
		</>
	);
};

export default WalletGeneratorModal;
