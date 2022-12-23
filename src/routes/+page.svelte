<script lang="ts">
	import { fade } from 'svelte/transition'
	import type { Nonprofit } from 'types/change'
	import Button from '~/components/forms/Button.svelte'
	import Charity from '~/components/Charity/Charity.svelte'
	import CharitySearch from '~/components/Charity/CharitySearch.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import Percentage from '~/components/forms/Percentage.svelte'
	import X from '~/components/icons/X.svelte'
	import MultiStep from '~/components/MultiStep/MultiStep.svelte'
	import Step from '~/components/MultiStep/Step.svelte'

	let designated: Nonprofit[] = []
	function addCharity(charity: Nonprofit) {
		removeCharity(charity)
		percentages = weights
			.concat(1)
			.map((w) => parseFloat(((w / (totalWeight + 1)) * 100).toFixed(1)) + '')
		designated = [...designated, charity]
	}
	function removeCharity(charity: Nonprofit) {
		const i = designated.findIndex((c) => c.id === charity.id)
		if (i < 0) return
		designated.splice(i, 1)
		percentages.splice(i, 1)
		designated = designated
		percentages = percentages
	}

	let percentages: string[] = []
	$: weights = percentages.map(
		(p) => ((parseFloat(p) || 0) / 100) * percentages.length
	)
	$: totalWeight = weights.reduce((total, w) => total + w, 0)
</script>

<Form id="search-charity" action="/dashboard?/search-charity" />
<MultiStep
	let:next
	let:complete
	let:reset
	leaveAlert="Are you sure you want to exit? You'll have to start the sign-up process again."
>
	<Form
		id="register"
		action="/api/auth?/register"
		on:load={(event) => {
			event.preventDefault() // prevent invalidating the page, which messes up the history stack & MultiStep
		}}
		on:loadend={(event) => {
			// We have to call this before complete, because we have a leaveAlert
			if (['success', 'redirect'].includes(event.detail.result?.type))
				complete()
		}}
		on:complete={next}
		let:values
	>
		<Step as="fieldset">
			<div
				role="heading"
				aria-level={1}
				class="text-4xl max-w-2xl text-center font-bold"
			>
				Donate <Percentage /> of your bank account to charity every year.
			</div>
			<p class="text-xl max-w-2xl text-center text-gray-500 mt-5 mb-8">
				Donated in monthly increments. Cancelable anytime.
			</p>
			{#if designated.length > 0}
				<div
					class="space-y-5 w-full max-w-md mb-5 [&:focus-within_.charity]:border-gray-200 [&:focus-within_.charity]:shadow-transparent [&:focus-within_input]:shadow [&:focus-within_input]:border-black"
				>
					{#each designated as item, i (item.id)}
						<Charity charity={item} class="charity transition-all">
							{#if designated.length > 1}
								<Input
									type="number"
									step="0.1"
									bind:value={percentages[i]}
									shadow="shadow-shadow focus:shadow-orange-500/10"
									border="border-transparent hover:border-gray-300 focus:!border-orange-500"
									padding="pl-0 pr-5 pb-2 pt-2.5"
									rounded="rounded-lg"
									align="text-right"
									width="w-16"
									min="0"
									max="100"
								>
									<span
										class="absolute top-1/2 right-2 -translate-y-1/2 font-medium text-gray-450"
										>%</span
									>
								</Input>
							{/if}
							<Button
								type="button"
								unstyled
								on:click={() => {
									removeCharity(item)
									if (designated.length === 0) reset()
								}}
								class="py-2 pl-2 transition-colors text-gray-300 hover:text-red-500"
							>
								<X class="h-4" />
							</Button>
						</Charity>
					{/each}
				</div>
			{/if}
			<CharitySearch
				form="search-charity"
				class="max-w-md w-full"
				label={designated.length > 0
					? 'Support another charity'
					: 'Which charity do you want to support?'}
				on:select={(event) => {
					event.preventDefault()
					addCharity(event.detail)
				}}
			/>
			<input
				type="hidden"
				name="designated"
				value={JSON.stringify(
					designated.map((c, i) => ({
						change_id: c.id,
						weight: weights[i]
					}))
				)}
			/>
			{#if designated.length > 0}
				<div in:fade|local class="mt-8 max-w-md w-full">
					<Button type="button" on:click={next}>Get started</Button>
				</div>
			{/if}
		</Step>
		<Step as="fieldset" let:active>
			<h2 class="text-3xl max-w-2xl font-bold mb-8 text-center">
				Create an account
			</h2>
			<div class="grid grid-cols-2 gap-6 max-w-md w-full">
				<Input
					required={active}
					type="text"
					name="first-name"
					label="First name"
				/>
				<Input
					required={active}
					type="text"
					name="last-name"
					label="Last name"
				/>
				<Input
					type="email"
					on:input={reset}
					class="col-span-full"
					required={active}
					name="email"
					label="Email"
					description="We'll send you a code to verify your email address."
				/>
			</div>
			<Button
				disabled={!active}
				formaction="/api/auth?/send-otp"
				name="new-user"
				class="mt-8 max-w-md"
			>
				Continue
			</Button>
		</Step>
		<Step as="fieldset" let:active>
			<h2 class="text-3xl max-w-xl text-center font-bold mb-5">
				Verify your email
			</h2>
			<p class="text-lg max-w-xl leading-snug mb-8 text-gray-500 text-center">
				Please enter the 6-digit code we sent to <mark>{values?.email}</mark>.
			</p>
			<Input
				class="max-w-xs"
				maxlength={6}
				required={active}
				type="text"
				name="token"
				label="Code"
			/>
			<Button disabled={!active} class="mt-8 max-w-xs">Continue</Button>
		</Step>
	</Form>
</MultiStep>
