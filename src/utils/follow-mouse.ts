import { type Signal } from '@builder.io/qwik';

interface FollowMouseProps {
	ballRef: Signal<HTMLElement | undefined>;
}

let x = 0;
let y = 0;
let request = 0;

export const animateBall = ({ ballRef }: FollowMouseProps) => {
	if (ballRef.value) {
		ballRef.value.style.left = `${x}px`;
		ballRef.value.style.top = `${y}px`;
		const callAnimate = () => animateBall({ ballRef });
		request = requestAnimationFrame(callAnimate);
	}
};

export const handleMouseMove = ({
	e,
	ballRef,
}: {
	e: any;
	ballRef: Signal<HTMLElement | undefined>;
}) => {
	console.log('hello');
	if (ballRef.value) {
		ballRef.value.style.transition = '0.1s';
	}

	x = e.offsetX;
	y = e.offsetY;
};

export const handleMouseOut = ({ ballRef }: FollowMouseProps) => {
	console.log('hello 2');
	if (ballRef.value) {
		ballRef.value.style.transition = 'all 500ms ease-in-out';
	}

	cancelAnimationFrame(request);
	if (ballRef.value) {
		(ballRef.value.style.left = '50%'), (ballRef.value.style.top = '50%');
	}
};
