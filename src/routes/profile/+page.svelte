<script lang="ts">
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	let email = data.session?.user.email
</script>

<h1 class="text-4xl font-bold text-center mb-8 max-w-2xl">Your profile</h1>
<div class="max-w-sm w-full">
	<Input
		class="mb-3"
		label="First name"
		value={data.profile?.first_name}
		disabled
	/>
	<Input
		label="Last name"
		value={data.profile?.last_name}
		disabled
		description="You're not able to change your name at this time."
	/>
	<Form action="?/update" let:complete>
		<p
			slot="complete"
			class="mt-6 bg-gray-100 rounded-3xl p-6 text-center"
			role="alert"
		>
			Click the link we sent to your new and old email addresses to confirm your
			change.
		</p>
		<Input
			class="mt-6"
			type="email"
			label="Email"
			name="email"
			bind:value={email}
			disabled={complete}
			showDescription={!complete && email !== data.session?.user.email}
			description="We'll send you a confirmation to complete your email change."
		/>
		<Button class="mt-8" type="submit" disabled={complete}>Save profile</Button>
	</Form>
	<Form
		action="?/delete"
		on:submit={(event) => {
			if (!confirm('Are you sure you want to delete your account?'))
				event.preventDefault()
		}}
	>
		<Button
			unstyled
			class="text-red-400 font-medium text-lg mt-8 w-full text-center"
			type="submit"
		>
			Delete account
		</Button>
	</Form>
</div>
