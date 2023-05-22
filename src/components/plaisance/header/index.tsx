import { $, PropFunction, component$, useOnDocument, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { isServer } from '@builder.io/qwik/build';
import { enter, leave } from '~/utils/el-transition';

interface HeaderProps {
	onClickCart$: PropFunction<() => void>;
	onClickMenu$: PropFunction<({ isShow }: { isShow: boolean }) => void>;
	totalItems: number;
}

const SEARCH_INPUT_TRANSITION = {
	'data-transition-enter': 'ease-out',
	'data-transition-enter-start': 'opacity-0 translate-x-full',
	'data-transition-enter-end': 'opacity-100 translate-x-0',
	'data-transition-leave': 'ease-in',
	'data-transition-leave-start': 'opacity-100 translate-x-0',
	'data-transition-leave-end': 'opacity-0 translate-x-full',
};

const MENU_TRANSITION = {
	'data-transition-enter-start': 'opacity-0 -translate-y-full',
	'data-transition-enter-end': 'opacity-100 -translate-y-0',
	'data-transition-leave-start': 'opacity-100 -translate-y-0',
	'data-transition-leave-end': 'opacity-0 -translate-y-full',
};

const CLOSE_TRANSITION = {
	'data-transition-enter-start': 'opacity-0 translate-y-full',
	'data-transition-enter-end': 'opacity-100 translate-y-0',
	'data-transition-leave-start': 'opacity-100 translate-y-0',
	'data-transition-leave-end': 'opacity-0 translate-y-full',
};

export default component$(({ onClickCart$, totalItems, onClickMenu$ }: HeaderProps) => {
	const isSearch = useSignal(false);
	const isShowMenuButton = useSignal(true);
	const isShowCloseButton = useSignal(false);
	const isScrolled = useSignal(false);

	const loc = useLocation();

	useTask$(({ track }) => {
		const isShowSearch = track(() => isSearch.value);
		if (isServer) return;
		const elementSearch = document.querySelector('#search-input');
		if (isShowSearch) {
			enter(elementSearch);
		} else {
			leave(elementSearch);
		}
	});

	useOnDocument(
		'click',
		$((event: any) => {
			const searchForm = document.getElementById('search-form');
			const isClickInside = searchForm?.contains(event.target);

			if (!isClickInside) {
				isSearch.value = false;
			}
		})
	);

	const onScrollHeader$ = $(() => {
		isScrolled.value =
			(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) >
			300;
	});

	return (
		<div>
			<header
				class={`fixed top-0 z-30 w-full px-5 py-6 transition-all duration-500 xs:px-10 lg:bg-transparent lg:py-10 ${
					isScrolled.value ? 'bg-dark-600' : ''
				}`}
				onScroll$={onScrollHeader$}
			>
				<nav class="flex items-center justify-between">
					<div class="relative mr-2 flex h-full flex-grow justify-between xs:mr-5">
						<div>
							{!isSearch.value && (
								<Link href="/" class="absolute left-0 transition sm:hidden">
									<img src="/img/logo.svg" width="100" alt="Logo" />
								</Link>
							)}
							<Link href="/" class="hidden sm:inline-block">
								<img src="/img/logo.svg" width="100" alt="Logo" />
							</Link>
						</div>
						<form id="search-form" action={`/${loc.params.lang}/search`} class="flex items-center">
							<input
								{...SEARCH_INPUT_TRANSITION}
								type="text"
								id="search-input"
								role="search"
								class={`absolute left-0 z-10 hidden w-full border-0 border-b border-red-700 bg-transparent py-1 pl-0 pr-7
                text-white transition duration-500 ease-in focus:border-purple-700 focus:ring-0 sm:left-auto sm:right-6 sm:w-60 sm:pr-0`}
								placeholder="Search.."
							/>
							<button
								type="button"
								onClick$={() => {
									isSearch.value = !isSearch.value;
								}}
								aria-controls="search-input"
								aria-expanded={isSearch.value}
								aria-label={`${isSearch.value ? 'Close' : 'Open'} Search Box`}
								class="relative z-20 ml-2 block text-3xl text-gray-100 transition-all duration-200 hover:text-gray-400"
							>
								<img src="/img/icons/search.svg" width="20" alt="" />
							</button>
						</form>
					</div>
					<div class="flex items-center space-x-3 text-white xs:space-x-5">
						<button
							onClick$={onClickCart$}
							class="flex items-center transition-all duration-200 hover:brightness-75"
						>
							<img src="/img/icons/cart.svg" width="20" alt="" />
							<span class="ml-1 text-sm">{totalItems}</span>
						</button>
						<div class="relative h-6 w-6">
							<button
								id="close-button"
								onClick$={() => {
									isShowMenuButton.value = true;
									isShowCloseButton.value = false;
									onClickMenu$?.({ isShow: isShowMenuButton.value });
									enter(document.getElementById('menu'));
									leave(document.getElementById('close-button'));
								}}
								{...CLOSE_TRANSITION}
								class={`absolute hidden cursor-pointer space-y-1 text-xl transition duration-500 ease-in hover:brightness-75`}
							>
								<img
									src="/img/icons/times.svg"
									width="25"
									height="25"
									loading="lazy"
									decoding="async"
									alt=""
								/>
							</button>
							<div
								id="menu"
								{...MENU_TRANSITION}
								onClick$={() => {
									isShowMenuButton.value = false;
									isShowCloseButton.value = true;
									onClickMenu$?.({ isShow: isShowMenuButton.value });
									leave(document.getElementById('menu'));
									enter(document.getElementById('close-button'));
								}}
								class={`absolute h-full transition duration-500`}
							>
								<div class="flex h-full cursor-pointer flex-col justify-center space-y-1">
									<div class="ml-auto h-[1px] w-4 bg-white"></div>
									<div class="h-[1px] w-6 bg-white"></div>
									<div class="mr-auto h-[1px] w-4 bg-white"></div>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
});
