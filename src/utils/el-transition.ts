interface ElementHTML extends Element {
	dataset: any;
}
export async function enter(element: Element | null, transitionName: string = '') {
	if (!element) return;
	element.classList.remove('hidden');
	await transition('enter', element, transitionName);
}

export async function leave(element: Element | null, transitionName: string = '') {
	if (!element) return;
	await transition('leave', element, transitionName);
	element.classList.add('hidden');
}

async function transition(direction: string, element: ElementHTML | null, animation: string) {
	if (!element) return;
	const dataset = element.dataset;
	if (!dataset) return;
	const animationClass = animation ? `${animation}-${direction}` : direction;
	const transition = `transition${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
	const genesis = dataset[transition] ? dataset[transition].split(' ') : [animationClass];
	const start = dataset[`${transition}Start`]
		? dataset[`${transition}Start`].split(' ')
		: [`${animationClass}-start`];
	const end = dataset[`${transition}End`]
		? dataset[`${transition}End`].split(' ')
		: [`${animationClass}-end`];

	addClasses(element, genesis);
	addClasses(element, start);
	await nextFrame();
	removeClasses(element, start);
	addClasses(element, end);
	await afterTransition(element);
	removeClasses(element, end);
	removeClasses(element, genesis);
}

function addClasses(element: Element | null, classes: string[]) {
	if (!element) return;
	element.classList.add(...classes);
}

function removeClasses(element: Element | null, classes: string[]) {
	if (!element) return;
	element.classList.remove(...classes);
}

function nextFrame() {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			requestAnimationFrame(resolve);
		});
	});
}

function afterTransition(element: Element | null) {
	if (!element) return;
	return new Promise<void>((resolve) => {
		// safari return string with comma separate values
		const computedDuration = getComputedStyle(element).transitionDuration.split(',')[0];
		const duration = Number(computedDuration.replace('s', '')) * 1000;
		setTimeout(() => {
			resolve();
		}, duration);
	});
}
