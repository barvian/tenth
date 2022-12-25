<script lang="ts">
	import { fade } from 'svelte/transition'
	import { SELF_CHANGE_ID, type Nonprofit } from '~/lib/change'
	import CharitySearch from '~/components/Charity/CharitySearch.svelte'
	import Designated from '~/components/Charity/Designated.svelte'
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import Percentage from '~/components/forms/Percentage.svelte'
	import MultiStep from '~/components/MultiStep/MultiStep.svelte'
	import Step from '~/components/MultiStep/Step.svelte'
	import type { Designation } from '~/lib/db'

	let designated: Designation[] = []
	function addCharity(nonprofit: Nonprofit) {
		if (designated.find((d) => d.nonprofit.id === nonprofit.id)) return

		let weight = 1
		if (nonprofit.id === SELF_CHANGE_ID) {
			const totalWeight = designated.reduce((total, d) => total + d.weight, 0)
			weight = Math.max(0.01 * totalWeight, 0.01)
		}
		designated = [...designated, { nonprofit, weight }]
	}
	function removeCharity(charity: Nonprofit) {
		designated = designated.filter((d) => d.nonprofit.id !== charity.id)
	}

	// Auto-save split when it's valid
	const handleSplitValid = (event: CustomEvent) => {
		const percentages = event.detail
		designated = designated.map((d, i) => ({
			...d,
			weight: (+percentages[i] / 100) * designated.length
		}))
	}
</script>

<Form id="search-charity" action="/dashboard?/search-charity" />
<MultiStep
	let:next
	let:complete
	let:reset
	let:step
	leaveAlert="Are you sure you want to exit? You'll have to start the sign-up process again."
>
	<Form
		id="register"
		action="/api/auth?/register"
		on:submit={(event) => {
			if (step === 0) {
				event.preventDefault()
				next()
			}
		}}
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
			<div class="flex flex-col gap-y-5 w-full max-w-md">
				<Designated
					{designated}
					on:remove={(event) => {
						removeCharity(event.detail.nonprofit)
						if (designated.length <= 0) reset()
					}}
					on:valid={handleSplitValid}
					let:valid
				>
					<CharitySearch
						form="search-charity"
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
							designated.map((d, i) => ({
								change_id: d.nonprofit.id,
								weight: d.weight
							}))
						)}
					/>
					{#if designated.length > 0}
						<div in:fade|local class="mt-3">
							<Button disabled={!valid}>Get started</Button>
						</div>
					{/if}
				</Designated>
			</div>
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
