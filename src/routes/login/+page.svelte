<script lang="ts">
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import MultiStep from '~/components/MultiStep/MultiStep.svelte'
	import Step from '~/components/MultiStep/Step.svelte'
	import { page } from '$app/stores'
</script>

<MultiStep let:next let:complete let:reset>
	<Form
		id="login"
		action="/api/auth?/login"
		on:load={(event) => {
			event.preventDefault() // prevent invalidating the page, which messes up the history stack & MultiStep
		}}
		on:loadend={(event) => {
			// Show the complete animation before the redirect
			if (['success', 'redirect'].includes(event.detail?.result?.type))
				complete()
		}}
		on:complete={next}
		let:values
	>
		<Step as="fieldset" let:active>
			<h1 class="text-4xl font-bold text-center mb-8">Sign in to Tenth</h1>
			<Input
				class="max-w-xs"
				required
				showRequired={false}
				type="email"
				name="email"
				label="Email"
				on:input={reset}
				description="We'll send you a code to get you signed in."
			/>
			<Button
				formaction="/api/auth?/send-otp"
				disabled={!active}
				class="mt-7 max-w-xs"
			>
				Sign in
			</Button>
		</Step>
		<Step as="fieldset" let:active>
			<h2 class="text-3xl font-bold text-center mb-5">Welcome back!</h2>
			<p class="text-lg text-gray-500 mb-8 leading-snug text-center">
				Please enter the 6-digit code we sent to <mark>{values?.email}</mark>.
			</p>
			<Input
				class="max-w-xs"
				required={active}
				showRequired={false}
				type="text"
				name="token"
				label="Code"
			/>
			<Input
				type="hidden"
				name="next"
				value={$page.url.searchParams.get('next')}
			/>
			<Button class="mt-7 max-w-xs">Continue</Button>
		</Step>
	</Form>
</MultiStep>
