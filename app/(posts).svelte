<script context="module" lang="ts">
	import type { LayoutServerLoad } from './(posts)/$types'
	import * as url from 'url'

	export const prerender = true

	export const getServerData = (async (event) => {
		const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
		const { metadata } = await import(
			/* @vite-ignore */
			`${__dirname}/(posts)${event.url.pathname}.md`
		)
		return { meta: metadata }
	}) satisfies LayoutServerLoad
</script>

<script lang="ts">
	import type { LayoutData } from './(posts)/$types'

	export let data: LayoutData
</script>

<article
	class="w-full max-w-prose prose prose-neutral text-justify prose-h1:text-center prose-h1:text-4xl prose-lead:text-center prose-lead:text-xl prose-lead:text-gray-500 prose-lead:font-normal prose-h1:mb-5 prose-lead:mt-5 prose-lead:mb-12"
>
	<h1>{data.meta.title}</h1>
	{#if data.meta.last_updated}
		<p class="lead">
			Last updated {new Date(data.meta.last_updated).toLocaleString('en-US', {
				dateStyle: 'short',
				timeStyle: 'long'
			})}
		</p>
	{/if}
	<slot />
</article>
