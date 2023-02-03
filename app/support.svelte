<script context="module" lang="ts">
	import type * as $types from './support/$types'
	import { marked } from 'marked'
	import faqs from '~/data/faqs.yml'

	export const prerender = true

	export const getServerData = (async () => ({
		meta: {
			title: 'Support',
			description: `Find help and support for Tenth`
		},
		faqs: await Promise.all(
			faqs.map(async ({ q, a }: { q: string; a: string }) => ({
				q,
				a: marked(a)
			}))
		)
	})) satisfies $types.PageServerLoad
</script>

<script lang="ts">
	import Button from '~/components/forms/Button.svelte'
	import Expander from '~/components/icons/Expander.svelte'

	export let data: $types.PageData
</script>

{#if data.session}
	<h1 class="text-4xl max-w-2xl mb-12 text-center">FAQs</h1>
{/if}

<div
	class="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 w-full max-w-4xl items-start"
>
	{#each data.faqs as { q, a }}
		<details class="rounded-3xl border shadow-md group pb-3">
			<summary
				class="flex gap-x-3 items-center text-lg font-medium px-8 pb-5 pt-8"
			>
				{q}
				<Expander class="-mt-1 ml-auto" />
			</summary>
			<div class="px-8 pb-5 pt-0 text-gray-500">{@html a}</div>
		</details>
	{/each}
</div>
<div
	class="max-w-4xl w-full gap-8 mt-8 flex justify-between items-center border-gray-100 border rounded-3xl px-8 py-5"
>
	<h2 class="text-xl text-gray-500">Not seeing your question?</h2>
	<Button width="w-min" href="mailto:support@tenth.to">Contact us</Button>
</div>
