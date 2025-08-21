import { useEffect } from 'react';

import { loadScript } from '@/utils/loading-script';
import publicUrl from '@/utils/public-url';

const chartingLibraryPath = publicUrl('/charting-library/charting_library/');

const configurationData = {
	// Represents the resolutions for bars supported by your datafeed
	supported_resolutions: ['1D', '1W', '1M'],
	// The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
	exchanges: [
		{ value: 'Bitfinex', name: 'Bitfinex', desc: 'Bitfinex' },
		{ value: 'Kraken', name: 'Kraken', desc: 'Kraken bitcoin exchange' },
	],
	// The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
	symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

export function TradeMain() {
	// useEffect(() => {
	// 	Promise.all([
	// 		loadScript(chartingLibraryPath + 'charting_library.standalone.js'),
	// 	  ]).then(() => {
	// 		const Datafeed = {
	// 			onReady: (callback) => {
	// 				console.log('[onReady]: Method call');
	// 				setTimeout(() => callback(configurationData));
	// 			},
	// 			searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
	// 				console.log('[searchSymbols]: Method call');
	// 			},
	// 			resolveSymbol: (
	// 				symbolName,
	// 				onSymbolResolvedCallback,
	// 				onResolveErrorCallback,
	// 				extension,
	// 			) => {
	// 				console.log('[resolveSymbol]: Method call', symbolName);
	// 			},
	// 			getBars: (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
	// 				console.log('[getBars]: Method call', symbolInfo);
	// 			},
	// 			subscribeBars: (
	// 				symbolInfo,
	// 				resolution,
	// 				onRealtimeCallback,
	// 				subscriberUID,
	// 				onResetCacheNeededCallback,
	// 			) => {
	// 				console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
	// 			},
	// 			unsubscribeBars: (subscriberUID) => {
	// 				console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
	// 			},
	// 		};

	// 		const tvWidget = new window.TradingView.widget({
	// 			symbol: 'BTC/EUR', // Default symbol pair
	// 			interval: '1D', // Default interval
	// 			fullscreen: false, // Displays the chart in the fullscreen mode
	// 			container: 'tv_chart_container', // Reference to the attribute of the DOM element
	// 			datafeed: Datafeed,
	// 			library_path: chartingLibraryPath,
	// 		});
	// 	  });
	// }, []);

	return (
		<div className="flex-center">
			<div className="w-full h-[50vh]">
				<div id="tv_chart_container"></div>
			</div>
		</div>
	);
}
