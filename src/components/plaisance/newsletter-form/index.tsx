import {
	$,
	Signal,
	component$,
	useSignal,
	useTask$,
	type QwikKeyboardEvent,
} from '@builder.io/qwik';
// @ts-ignore
import Rolldate from 'rolldate';
import { useTrapFocus } from '~/hooks/use-trap-focus';
import { enter, leave } from '~/utils/el-transition';

const TRANSITION = {
	'data-transition-enter': 'transition ease-out duration-500',
	'data-transition-enter-start': '-translate-y-full',
	'data-transition-enter-end': '-translate-y-0',
	'data-transition-leave': 'transition ease-in duration-300',
	'data-transition-leave-start': '-translate-y-0',
	'data-transition-leave-end': '-translate-y-full',
};

const TRANSITION2 = {
	'data-transition-enter': 'transition ease-out duration-500',
	'data-transition-enter-start': 'translate-y-full',
	'data-transition-enter-end': 'translate-y-0',
	'data-transition-leave': 'transition ease-in duration-300',
	'data-transition-leave-start': 'translate-y-0',
	'data-transition-leave-end': 'translate-y-full',
};

const COMPLETE_TRANSITION = {
	'data-transition-enter': 'transition ease-out duration-500',
	'data-transition-enter-start': '-translate-x-full opacity-0',
	'data-transition-enter-end': '-translate-x-0 opacity-100',
	'data-transition-leave': 'transition ease-in duration-300',
	'data-transition-leave-start': '-translate-x-0 opacity-100',
	'data-transition-leave-end': '-translate-x-full opacity-0',
};

export default component$(() => {
	const isValidEmail = useSignal(true);
	const isShowForm = useSignal(false);
	const currentStepName = useSignal('');
	const step = useSignal<number | string>(1);
	const error = useSignal<string | null>('');
	const firstname = useSignal('');
	const lastname = useSignal('');
	const email = useSignal('');
	const birthdate = useSignal('');
	const privacyPolicy = useSignal('');

	const step1Ref = useSignal<Element>();
	const step2Ref = useSignal<Element>();
	const step3Ref = useSignal<Element>();
	const step4Ref = useSignal<Element>();
	const step5Ref = useSignal<Element>();
	const stepCompleteRef = useSignal<Element>();

	useTrapFocus({
		containerRef: step1Ref as Signal<Element>,
	});
	useTrapFocus({
		containerRef: step2Ref as Signal<Element>,
	});
	useTrapFocus({
		containerRef: step3Ref as Signal<Element>,
	});
	useTrapFocus({
		containerRef: step4Ref as Signal<Element>,
	});
	useTrapFocus({
		containerRef: step5Ref as Signal<Element>,
	});
	useTrapFocus({
		containerRef: stepCompleteRef as Signal<Element>,
	});

	useTask$(({ track }) => {
		const stepForm = track(() => step.value);
		switch (stepForm) {
			case 1: {
				currentStepName.value = 'firstname';
				break;
			}
			case 2: {
				currentStepName.value = 'lastname';
				break;
			}
			case 3: {
				currentStepName.value = 'email';
				break;
			}
			case 4: {
				currentStepName.value = 'birthdate';
				break;
			}
			case 5: {
				currentStepName.value = 'privacyPolicy';
				break;
			}
			default: {
				currentStepName.value = 'complete';
				break;
			}
		}
	});

	const validateEmail$ = $((email: string) => {
		return email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ /* eslint-disable-line */
		);
	});

	const goNext$ = $(() => {
		if (error.value === '' || error.value) {
			error.value = currentStepName.value;
		} else {
			leave(document.querySelector(`#step-${step.value}`)).then(() => {
				step.value = Number(step.value) + 1;
				error.value = '';
				enter(document.querySelector(`#step-${step.value}`));
			});
		}
	});

	const onKeyUp$ = $((e: QwikKeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' || e.keyCode === 13) {
			goNext$();
		}
	});

	const goPrev$ = $(() => {
		if (Number(step.value) > 1) {
			step.value = Number(step.value) - 1;
		} else {
			step.value = 1;
		}
		error.value = null;
	});

	const handleSubmit$ = $(() => {
		if (Number(step.value) < 5) {
			goNext$();
		} else {
			if (privacyPolicy?.value === 'accepted') {
				step.value = 'complete';
			} else {
				reset$();
			}
		}
	});

	const reset$ = $(() => {
		firstname.value = '';
		lastname.value = '';
		email.value = '';
		birthdate.value = '';
		privacyPolicy.value = '';
		step.value = 1;
		isShowForm.value = false;
	});

	return (
		<>
			<section class="py-12 lg:mt-40 lg:py-24">
				<div class="container max-w-2xl pt-5">
					<h2 class="text-center font-heading text-2xl font-bold text-white sm:text-4xl">
						Sign up to our newsletter to receive updates, exclusive discounts, and VIP access.
					</h2>
					<div class="mt-8 flex justify-center">
						<button
							onClick$={() => {
								isShowForm.value = true;
							}}
							class="btn-outline"
						>
							Count me in!
						</button>
					</div>
				</div>
			</section>
			{isShowForm.value && (
				<div class="fixed inset-0 z-40 bg-black/95 transition-opacity duration-500">
					<form action="#" class="h-full w-full">
						<button
							type="button"
							class="fixed right-4 top-4 z-50 text-white hover:text-red-600"
							onClick$={() => {
								isShowForm.value = false;
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
						<div class="relative mx-auto h-full w-full max-w-3xl py-10">
							{step.value === 'complete' && (
								<div
									id="step-complete"
									class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
									{...COMPLETE_TRANSITION}
								>
									<div>
										<p class="text-center font-heading text-lg font-bold text-white sm:text-2xl">
											You're all set. You'll see us in your inbox soon!
										</p>
										<div class="mt-2 text-center text-green-600">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="mx-auto h-12 w-12"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
										<div class="mt-4 text-center">
											<button type="button" onClick$={reset$} class="btn-outline">
												Return
											</button>
										</div>
									</div>
								</div>
							)}

							{step.value === 1 && (
								<div
									id="step-1"
									ref={step1Ref}
									class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
									{...TRANSITION}
								>
									<div>
										<label for="firstname" class="block font-heading text-3xl text-white">
											First up, what is your first name?
										</label>
										<input
											type="text"
											id="firstname"
											onKeyUp$={onKeyUp$}
											placeholder="type your first name here"
											class="w-full border-0 border-b border-white bg-transparent pl-0 font-heading text-lg text-white focus:border-red-500 focus:ring-0 xs:text-3xl"
											onInput$={(e: Event) => {
												firstname.value = (e.target as HTMLInputElement).value;
												error.value = firstname.value ? null : 'firstname';
											}}
										/>
										<div class="mt-4 flex items-center space-x-2">
											<button
												disabled={error.value === 'firstname'}
												onClick$={goNext$}
												type="button"
												class="btn-outline px-3 py-2 font-sans text-sm"
											>
												<span>Ok</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</button>
											<p class="text-sm text-gray-100">
												press <b>Enter ↩</b>
											</p>
										</div>
									</div>
								</div>
							)}
							{step.value === 2 && (
								<div
									id="step-2"
									ref={step2Ref}
									class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
									{...TRANSITION2}
								>
									<div>
										<label for="lastname" class="block font-heading text-3xl text-white">
											And your last name?
										</label>
										<input
											type="text"
											id="lastname"
											onKeyUp$={onKeyUp$}
											placeholder="type your lastname here"
											class="w-full border-0 border-b border-white bg-transparent pl-0 font-heading text-lg text-white focus:border-red-500 focus:ring-0 xs:text-3xl"
											onInput$={(e: Event) => {
												lastname.value = (e.target as HTMLInputElement).value;
												error.value = lastname.value ? null : 'lastname';
											}}
										/>
										<div class="mt-4 flex items-center space-x-2">
											<button
												disabled={error.value === 'lastname'}
												onClick$={goNext$}
												type="button"
												class="btn-outline px-3 py-2 font-sans text-sm"
											>
												<span>Ok</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</button>
											<p class="text-sm text-gray-100">
												press <b>Enter ↩</b>
											</p>
										</div>
									</div>
								</div>
							)}
							{step.value === 3 && (
								<div
									id="step-3"
									ref={step3Ref}
									class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
									{...TRANSITION2}
								>
									<div>
										<div class="relative">
											<label for="email" class="block font-heading text-3xl text-white">
												Great! Now what's your email,
												<span x-text="firstname"></span>?
											</label>
											<input
												type="email"
												id="email"
												onKeyUp$={onKeyUp$}
												autoComplete="off"
												placeholder="type your email here"
												class="w-full border-0 border-b border-white bg-transparent pl-0 font-heading text-lg text-white focus:border-red-500 focus:ring-0 xs:text-3xl"
												onInput$={async (e: Event) => {
													email.value = (e.target as HTMLInputElement).value;
													const emailArr = await validateEmail$(email.value);
													isValidEmail.value = Boolean(emailArr);
													error.value = email.value ? null : 'email';
												}}
											/>
											{!isValidEmail.value && (
												<p class="absolute top-full text-sm font-medium text-red-600 transition">
													Please enter a valid email
												</p>
											)}
										</div>
										<div class="mt-6 flex items-center space-x-2">
											<button
												disabled={error.value === 'email'}
												onClick$={goNext$}
												type="button"
												class="btn-outline px-3 py-2 font-sans text-sm"
											>
												<span>Ok</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</button>
											<p class="text-sm text-gray-100">
												press <b>Enter ↩</b>
											</p>
										</div>
									</div>
								</div>
							)}
							{step.value === 4 && (
								<div
									id="step-4"
									ref={step4Ref}
									class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
									{...TRANSITION2}
								>
									<div>
										<div>
											<label for="birthdate" class="block font-heading text-3xl text-white">
												Oh, one last thing. When's your birthday? We might have a little something
												for you then.
											</label>
											<input
												type="text"
												id="date-picker"
												onClick$={() => {
													const rd = new Rolldate({
														el: '#date-picker',
														format: 'MM-DD-YYYY',
														beginYear: 1920,
														endYear: 2100,
														lang: {
															title: 'Select A Date',
															cancel: 'Cancel',
															confirm: 'Confirm',
															year: '',
															month: '',
															day: '',
														},
														confirm: function (date: any) {
															birthdate.value = date;
															error.value = birthdate.value ? null : 'birthdate';
														},
													});
													rd.show();
												}}
												readOnly
												placeholder="Select A date"
												class="mt-3 w-full cursor-default border-0 border-b border-white bg-transparent pl-0 font-heading text-lg text-white focus:border-red-500 focus:ring-0 xs:text-3xl"
											/>
											<div class="mt-6 flex items-center space-x-2">
												<button
													disabled={error.value === 'birthdate'}
													onClick$={goNext$}
													type="button"
													class="btn-outline px-3 py-2 font-sans text-sm"
												>
													<span>Ok</span>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M5 13l4 4L19 7"
														/>
													</svg>
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
							{step.value === 5 && (
								<div
									id="step-5"
									ref={step5Ref}
									class="absolute inset-0 flex h-full w-full flex-col justify-center px-5 sm:px-10"
									{...TRANSITION2}
								>
									<div>
										<div>
											<p class="mb-3 block font-heading text-3xl text-white">
												Finally, do you accept our
												<a href="/en/privacy-policy.html" class="hover:underline">
													Privacy Policy
												</a>
												?
											</p>
											<div class="items-center xs:flex xs:space-x-3">
												<label
													for="accept"
													class="mb-2 flex cursor-pointer items-center space-x-2 xs:mb-0"
												>
													<input
														type="radio"
														class="bg-transparent text-red-600"
														id="accept"
														name="privacy-policy"
														value="accepted"
														onClick$={() => {
															privacyPolicy.value = 'accepted';
														}}
													/>
													<span class="text-white">I accept</span>
												</label>
												<label for="notAccept" class="flex cursor-pointer items-center space-x-2">
													<input
														type="radio"
														class="bg-transparent text-red-600"
														name="privacy-policy"
														id="notAccept"
														value="not-accepted"
														onClick$={() => {
															privacyPolicy.value = 'not-accepted';
														}}
													/>
													<span class="text-white">I don't accept</span>
												</label>
											</div>
										</div>
										<div class="mt-8">
											<button type="button" class="btn-outline" onClick$={handleSubmit$}>
												Submit
											</button>
										</div>
									</div>
								</div>
							)}
							{step.value === 'complete' && (
								<div
									ref={stepCompleteRef}
									class="absolute bottom-2 right-0 flex items-center space-x-3"
								>
									<button
										type="button"
										onClick$={goPrev$}
										disabled={Number(step.value) <= 1}
										class="p-2 text-white transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 hover:disabled:text-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M5 15l7-7 7 7"
											/>
										</svg>
									</button>
									<button
										type="button"
										onClick$={() => {
											if (Number(step.value) <= 5) {
												goNext$();
											} else {
												step.value = 5;
											}
										}}
										disabled={Number(step.value) === 5 || Boolean(error.value)}
										class="p-2 text-white transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 hover:disabled:text-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>
								</div>
							)}
						</div>
					</form>
				</div>
			)}
		</>
	);
});
