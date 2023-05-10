import { component$, Slot } from '@builder.io/qwik';
import Footer from '~/components/footer/footer';

export default component$(() => {
	return (
		<>
			<h1 class="text-white">LAYOUT</h1>
			<Slot />
			<Footer />
		</>
	);
});
