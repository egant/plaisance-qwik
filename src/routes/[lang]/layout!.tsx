import { component$, Slot } from '@builder.io/qwik';
import Footer from '~/components/plaisance/footer';

export default component$(() => {
	return (
		<>
			<Slot />
			<Footer />
		</>
	);
});
