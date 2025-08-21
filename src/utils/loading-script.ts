export const loadScript = (url: string) => {
	return new Promise((resolve) => {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.onload = resolve;
		script.src = url;
		document!.getElementsByTagName('head')[0]!.appendChild(script);
	});
};
