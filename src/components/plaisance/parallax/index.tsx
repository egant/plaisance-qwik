import { $, component$, useOnDocument, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { scrollAnchors } from '~/utils/scroll-anchors';
import FlavorsSection from './flavors';
import IdentitySection from './identity';
import TraditionSection from './tradition';
import WinInMixtureSection from './win-in-mixture';

const ACTIVE_SECTION = new Map();
ACTIVE_SECTION.set('winIsAMixtureContent', 'winIsAMixture');
ACTIVE_SECTION.set('traditionContent', 'tradition');
ACTIVE_SECTION.set('identityContent', 'identity');
ACTIVE_SECTION.set('flavorsContent', 'flavors');

export default component$(() => {
	const activeSection = useSignal('winIsAMixture');
	useOnDocument(
		'scroll',
		$(() => {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const sectionContent = entry.target.querySelectorAll('.section-content');
						const banner = entry.target.querySelector('.banner-bg');
						if (entry.isIntersecting) {
							banner?.classList.add('zoom-out');
							sectionContent.forEach((element) => {
								activeSection.value = ACTIVE_SECTION.get(element.id) || '';
								element.classList.add('slide-up');
							});
							return;
						}
						banner?.classList.remove('zoom-out');
						sectionContent.forEach((element) => {
							element.classList.remove('slide-up');
						});
					});
				},
				{
					root: null,
					threshold: 0.1,
				}
			);
			const sections = document.querySelectorAll('section');
			sections.forEach(function (v, i) {
				observer.observe(sections[i]);
			});
		})
	);

	return (
		<div id="paralax" class="relative h-[400vh]">
			<WinInMixtureSection activeSection={activeSection} />
			<TraditionSection activeSection={activeSection} />
			<IdentitySection activeSection={activeSection} />
			<FlavorsSection activeSection={activeSection} />

			<div class="sticky bottom-16 left-10 top-0 z-10 -mt-12 mb-0 w-20">
				<div class="flex flex-col space-y-4">
					<Link
						id="winIsAMixtureBullet"
						href="#winIsAMixture"
						onClick$={() => scrollAnchors(document.getElementById('winIsAMixtureBullet'))}
						class={`inline-block h-[5px] w-[5px] flex-none rounded-full transition duration-100 ${
							activeSection.value === 'winIsAMixture' ? 'scale-150 bg-red-700' : 'bg-white'
						}`}
					></Link>
					<Link
						id="traditionBullet"
						href="#tradition"
						onClick$={() => scrollAnchors(document.getElementById('traditionBullet'))}
						class={`inline-block h-[5px] w-[5px] flex-none rounded-full transition duration-100 ${
							activeSection.value === 'tradition' ? 'scale-150 bg-red-700' : 'bg-white'
						}`}
					></Link>
					<Link
						id="identityBullet"
						href="#identity"
						onClick$={() => scrollAnchors(document.getElementById('identityBullet'))}
						class={`inline-block h-[5px] w-[5px] flex-none rounded-full transition duration-100 ${
							activeSection.value === 'identity' ? 'scale-150 bg-red-700' : 'bg-white'
						}`}
					></Link>
					<Link
						id="flavorsBullet"
						href="#flavors"
						onClick$={() => scrollAnchors(document.getElementById('flavorsBullet'))}
						class={`inline-block h-[5px] w-[5px] flex-none rounded-full transition duration-100 ${
							activeSection.value === 'flavors' ? 'scale-150 bg-red-700' : 'bg-white'
						}`}
					></Link>
				</div>
			</div>
		</div>
	);
});
