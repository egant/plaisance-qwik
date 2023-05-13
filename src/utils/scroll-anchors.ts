export function scrollAnchors(respond: any) {
	const distanceToTop = (el: Element) => Math.floor(el.getBoundingClientRect().top);
	const splitHref = respond?.getAttribute('href').split('#');
	const targetID = `#${splitHref[splitHref.length - 1]}`;
	const targetAnchor = document.querySelector(targetID);
	if (!targetAnchor) return;
	const originalTop = distanceToTop(targetAnchor);
	window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
	const checkIfDone = setInterval(function () {
		const atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
		if (distanceToTop(targetAnchor) === 0 || atBottom) {
			// @ts-ignore
			targetAnchor.tabIndex = '-1';
			// @ts-ignore
			targetAnchor.focus();
			window.history.pushState('', '', targetID);
			clearInterval(checkIfDone);
		}
	}, 100);
}
