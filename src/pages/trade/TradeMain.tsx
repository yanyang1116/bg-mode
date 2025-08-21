import { useEffect, useRef } from 'react';

import { loadScript } from '@/utils/loading-script';
import publicUrl from '@/utils/public-url';

const chartingLibraryPath = publicUrl('/charting-library/charting_library/');

// 移动端优化配置
const mobileConfigurationData = {
	// 移动端支持的时间周期
	supported_resolutions: ['1', '5', '15', '30', '1H', '4H', '1D', '1W'],
	// 交易所配置
	exchanges: [
		{ value: 'Binance', name: 'Binance', desc: 'Binance Exchange' },
		{ value: 'OKX', name: 'OKX', desc: 'OKX Exchange' },
	],
	// 代币类型
	symbols_types: [{ name: 'crypto', value: 'crypto' }],
	// 移动端特殊配置
	supports_marks: true,
	supports_timescale_marks: true,
	supports_time: true,
	timezone: 'Etc/UTC',
};

// Mock K线数据生成器
const generateMockBars = (count = 100) => {
	const bars = [];
	const now = Date.now();
	const oneDay = 24 * 60 * 60 * 1000;
	let basePrice = 45000; // BTC基础价格
	
	for (let i = count - 1; i >= 0; i--) {
		const time = now - (i * oneDay);
		const volatility = 0.02; // 2% 波动率
		const change = (Math.random() - 0.5) * 2 * volatility;
		
		const open = basePrice;
		const close = open * (1 + change);
		const high = Math.max(open, close) * (1 + Math.random() * 0.01);
		const low = Math.min(open, close) * (1 - Math.random() * 0.01);
		const volume = Math.random() * 1000000 + 500000;
		
		bars.push({
			time: Math.floor(time / 1000),
			open: Math.round(open * 100) / 100,
			high: Math.round(high * 100) / 100,
			low: Math.round(low * 100) / 100,
			close: Math.round(close * 100) / 100,
			volume: Math.round(volume),
		});
		
		basePrice = close; // 下一根K线的开盘价
	}
	
	return bars;
};

// 成本价配置
const COST_PRICE = 43500; // Mock成本价

export function TradeMain() {
	const widgetRef = useRef<any>(null);
	
	useEffect(() => {
		Promise.all([
			loadScript(chartingLibraryPath + 'charting_library.standalone.js'),
		]).then(() => {
			// Mock数据缓存
			const mockBars = generateMockBars(200);
			
			const Datafeed = {
				onReady: (callback: any) => {
					console.log('[onReady]: 移动端数据源初始化');
					setTimeout(() => callback(mobileConfigurationData), 0);
				},
				
				searchSymbols: (userInput: string, exchange: string, symbolType: string, onResultReadyCallback: any) => {
					console.log('[searchSymbols]: 搜索代币', userInput);
					// 返回mock搜索结果
					const symbols = [
						{
							symbol: 'BTC/USDT',
							full_name: 'Bitcoin/Tether',
							description: 'Bitcoin vs Tether',
							exchange: 'Binance',
							ticker: 'BTCUSDT',
							type: 'crypto'
						},
						{
							symbol: 'ETH/USDT', 
							full_name: 'Ethereum/Tether',
							description: 'Ethereum vs Tether',
							exchange: 'Binance',
							ticker: 'ETHUSDT',
							type: 'crypto'
						}
					];
					onResultReadyCallback(symbols.filter(s => 
						s.symbol.toLowerCase().includes(userInput.toLowerCase())
					));
				},
				
				resolveSymbol: (
					symbolName: string,
					onSymbolResolvedCallback: any,
					onResolveErrorCallback: any,
				) => {
					console.log('[resolveSymbol]: 解析代币', symbolName);
					
					// 返回代币信息
					const symbolInfo = {
						ticker: symbolName,
						name: symbolName,
						description: symbolName === 'BTC/USDT' ? 'Bitcoin/Tether' : 'Cryptocurrency',
						type: 'crypto',
						session: '24x7',
						timezone: 'Etc/UTC',
						exchange: 'Binance',
						minmov: 1,
						pricescale: 100,
						has_intraday: true,
						has_weekly_and_monthly: true,
						supported_resolutions: mobileConfigurationData.supported_resolutions,
						volume_precision: 2,
						data_status: 'streaming',
					};
					
					setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
				},
				
				getBars: (symbolInfo: any, resolution: string, periodParams: any, onHistoryCallback: any, onErrorCallback: any) => {
					console.log('[getBars]: 获取K线数据', symbolInfo.ticker, resolution);
					
					try {
						// 根据时间范围过滤数据
						const { from, to } = periodParams;
						const filteredBars = mockBars.filter(bar => 
							bar.time >= from && bar.time <= to
						);
						
						if (filteredBars.length === 0) {
							onHistoryCallback([], { noData: true });
						} else {
							onHistoryCallback(filteredBars, { noData: false });
						}
					} catch (error) {
						console.error('获取K线数据失败:', error);
						onErrorCallback(error);
					}
				},
				
				subscribeBars: (
					symbolInfo: any,
					resolution: string,
					onRealtimeCallback: any,
					subscriberUID: string,
				) => {
					console.log('[subscribeBars]: 订阅实时数据', subscriberUID);
					// Mock实时数据更新
					const interval = setInterval(() => {
						const lastBar = mockBars[mockBars.length - 1];
						if (lastBar) {
							const updatedBar = {
								...lastBar,
								close: lastBar.close * (1 + (Math.random() - 0.5) * 0.001), // 小幅波动
								volume: lastBar.volume + Math.random() * 10000,
							};
							onRealtimeCallback(updatedBar);
						}
					}, 3000); // 每3秒更新一次
					
					// 存储interval用于清理
					(window as any).tradingViewInterval = interval;
				},
				
				unsubscribeBars: (subscriberUID: string) => {
					console.log('[unsubscribeBars]: 取消订阅', subscriberUID);
					if ((window as any).tradingViewInterval) {
						clearInterval((window as any).tradingViewInterval);
					}
				},
			};

			// 移动端优化的TradingView配置
			const mobileWidgetOptions = {
				symbol: 'BTC/USDT', // 默认交易对
				interval: '1H', // 移动端默认1小时线
				container: 'tv_chart_container',
				datafeed: Datafeed,
				library_path: chartingLibraryPath,
				locale: 'en', // 使用英文界面
				disabled_features: [
					'use_localstorage_for_settings',
					'volume_force_overlay',
					'create_volume_indicator_by_default',
					'header_compare',
					'header_symbol_search',
					'header_resolutions',
					'header_chart_type',
					'header_settings',
					'header_indicators',
					'header_screenshot',
					'header_undo_redo',
					'legend_context_menu',
					'context_menus',
					'control_bar',
					'timeframes_toolbar',
				],
				enabled_features: [
					'study_templates',
					'side_toolbar_in_fullscreen_mode',
					'header_in_fullscreen_mode',
					'hide_left_toolbar_by_default',
				],
				// 移动端手势支持
				overrides: {
					'paneProperties.background': 'var(--background)',
					'paneProperties.vertGridProperties.color': 'var(--border)',
					'paneProperties.horzGridProperties.color': 'var(--border)',
					'symbolWatermarkProperties.transparency': 90,
					'scalesProperties.textColor': 'var(--foreground)',
					'scalesProperties.backgroundColor': 'var(--background)',
				},
				// 移动端布局优化
				fullscreen: false,
				autosize: true,
				// 禁用工具栏以适应移动端
				toolbar_bg: 'var(--background)',
				// 移动端主题
				theme: 'dark',
				// 移动端触摸优化
				custom_css_url: '/charting-library/themed.css',
			};

			// 创建图表实例
			const tvWidget = new (window as any).TradingView.widget(mobileWidgetOptions);
			widgetRef.current = tvWidget;
			
			// 图表加载完成后添加成本价线
			tvWidget.onChartReady(() => {
				console.log('图表加载完成，添加成本价线');
				
				// 添加成本价水平线
				tvWidget.chart().createShape({
					time: mockBars[0].time,
					price: COST_PRICE,
				}, {
					shape: 'horizontal_line',
					overrides: {
						linecolor: 'var(--yellow)',
						linestyle: 1, // 虚线
						linewidth: 2,
						showLabel: true,
						textcolor: 'var(--yellow)',
						text: `Cost Price: $${COST_PRICE}`,
					}
				});
				
				// 移动端手势优化
				tvWidget.chart().setChartType(1); // 蜡烛图
				
				// 禁用一些不适合移动端的功能
				tvWidget.chart().executeActionById('chartProperties');
			});
		});
		
		// 清理函数
		return () => {
			if (widgetRef.current) {
				widgetRef.current.remove();
			}
			if ((window as any).tradingViewInterval) {
				clearInterval((window as any).tradingViewInterval);
			}
		};
	}, []);

	return (
		<div className="w-full h-full">
			{/* 移动端优化的图表容器 */}
			<div className="w-full h-[70vh] min-h-[400px] relative">
				<div 
					id="tv_chart_container" 
					className="w-full h-full"
					style={{ 
						touchAction: 'pan-x pan-y', // 启用移动端手势
						userSelect: 'none', // 防止文本选择
					}}
				/>
			</div>
			
			{/* 移动端交易信息面板 */}
			<div className="bg-card border-t border-border p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<span className="text-lg font-semibold text-foreground">BTC/USDT</span>
						<span className="text-sm text-muted-foreground">Binance</span>
					</div>
					<div className="text-right">
						<div className="text-lg font-bold text-green">$45,234.56</div>
						<div className="text-sm text-green">+2.34%</div>
					</div>
				</div>
				
				<div className="grid grid-cols-3 gap-4 text-sm">
					<div className="text-center">
						<div className="text-muted-foreground">24h High</div>
						<div className="font-medium text-foreground">$46,789.12</div>
					</div>
					<div className="text-center">
						<div className="text-muted-foreground">24h Low</div>
						<div className="font-medium text-foreground">$44,123.45</div>
					</div>
					<div className="text-center">
						<div className="text-muted-foreground">Volume</div>
						<div className="font-medium text-foreground">1.2M</div>
					</div>
				</div>
				
				{/* 成本价信息 */}
				<div className="flex items-center justify-between p-3 bg-card-bg-light rounded-lg border border-border">
					<div className="flex items-center space-x-2">
						<div className="w-3 h-0.5 bg-[var(--yellow)]"></div>
						<span className="text-sm text-muted-foreground">Cost Price</span>
					</div>
					<span className="text-sm font-medium text-[var(--yellow)]">${COST_PRICE.toLocaleString()}</span>
				</div>
			</div>
		</div>
	);
}
