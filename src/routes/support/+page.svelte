<script lang="ts">
	import type { PageData } from './$types'
	import Button from '~/components/Button.svelte'
	import Expander from '~/components/icons/Expander.svelte'

	export let data: PageData
</script>

<h1 class="text-4xl max-w-2xl mb-12 text-center leading-tight font-bold">
	FAQs
</h1>

<div
	class="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 w-full max-w-4xl items-start"
>
	{#each data.faqs as { q, a }}
		<details class="rounded-3xl border shadow-md group">
			<summary class="flex gap-x-3 items-center text-lg font-medium p-8">
				{q}
				<Expander class="-mt-1 ml-auto" />
			</summary>
			<div class="p-8 pt-0 text-gray-500">{@html a}</div>
		</details>
	{/each}
</div>

<h2 class="text-xl text-gray-500 mt-20 mb-8">Not seeing your question?</h2>
<Button width="w-min" href="mailto:support@tenth.to">Contact us</Button>
