<script lang="ts">
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	let email = data.session?.user.email
</script>

<h1 class="text-4xl font-bold text-center mb-8 max-w-2xl">Your profile</h1>
<Form
	id="update"
	action="?/update"
	class="grid grid-cols-2 gap-6 max-w-md w-full"
	let:data={response}
>
	<Input name="first" label="First name" required value={data.first_name} />
	<Input name="last" label="Last name" required value={data.last_name} />
	{#if response?.email_changed}
		<p
			class="bg-gray-100 rounded-2xl p-6 text-center col-span-full"
			role="alert"
		>
			Click the link we sent to your new and old email addresses to confirm your
			change.
		</p>
	{:else}
		<Input
			type="email"
			label="Email"
			name="email"
			class="col-span-full"
			bind:value={email}
			showDescription={email !== data.session?.user.email}
			description="We'll send you a confirmation to complete your email change."
		/>
	{/if}
	<Button class="mt-2 col-span-full">Save profile</Button>
</Form>
<Form
	id="delete"
	action="?/delete"
	on:submit={(event) => {
		if (!confirm('Are you sure you want to delete your account?'))
			event.preventDefault()
	}}
>
	<Button
		unstyled
		class="text-red-400 font-medium text-lg mt-8 max-w-md w-full text-center"
	>
		Delete account
	</Button>
</Form>
