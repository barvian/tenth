<script lang="ts">
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Form id="request">
	<svelte:fragment slot="complete" let:values>
		<h2 class="text-3xl max-w-xl text-center font-bold mb-5">
			We received your request!
		</h2>
		<p class="text-lg max-w-xl leading-snug mb-8 text-gray-500 text-center">
			{#if data?.session || values?.email}
				We'll send updates to <span class="text-black">{values?.email}</span> as
				we get them.
			{:else}
				Feel free to check back in a few days.
			{/if}
		</p>
		<Button href="/" width="w-min">Go home</Button>
	</svelte:fragment>

	<header class="text-center max-w-2xl mb-8">
		<h1 class="text-4xl font-bold">Request a charity</h1>
		<p class="max-w-sm mx-auto mt-8 bg-gray-100 rounded-3xl p-6">
			If you're a member of a charity and wish to accept donations from Tenth,
			you can <a
				class="font-medium text-red-400"
				href="https://www.pledge.to/claims/new"
				>claim your charity on the Pledge network</a
			>, which Tenth uses.
		</p>
	</header>

	<fieldset class="max-w-sm flex flex-col gap-6">
		<Input
			autocomplete="off"
			type="text"
			name="ngo_id"
			label="EIN"
			placeholder="e.g. 41-1627391"
			required
			description={`Not sure where to find this? Search for your charity on <a rel="external" href="http://www.guidestar.org/" target="_blank">Guidestar</a>.`}
		/>

		{#if !data?.session}
			<Input
				type="email"
				name="email"
				label="Your email"
				description="If provided, we'll email you updates about your request."
			/>
		{/if}
		<Button class="mt-2">Request</Button>
	</fieldset>
</Form>
