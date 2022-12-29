<script lang="ts">
	import clsx, { type ClassValue } from 'clsx'
	import type { Nonprofit } from 'types/change'

	export let as = 'div'
	let cls: ClassValue = null
	export { cls as class }
	export let titleSize = 'text-lg'
	export let bg: ClassValue = 'bg-white'
	export let border: ClassValue = 'border'
	export let padding: ClassValue = 'p-4'
	export let shadow: ClassValue = 'shadow'
	export let imgWidth: ClassValue = 'w-13'
	export let titleMargin: ClassValue = 'mb-1.5'
	export let charity: Nonprofit | null = null
	let url: URL | null

	$: if (charity?.website) {
		let site = charity.website
		if (!/^https?:\/\//i.test(site)) site = 'http://' + site
		try {
			url = new URL(site)
			if (!url.hostname?.includes('.')) url = null
		} catch (e) {
			// we'll not use the url, that's fine
		}
	}
</script>

<svelte:element
	this={as}
	on:click
	class={clsx(
		cls,
		'rounded-2xl relative flex w-full text-left items-center',
		bg,
		border,
		padding,
		shadow
	)}
	{...$$restProps}
>
	<img
		class="{imgWidth} object-fit aspect-square mr-3"
		class:rounded-lg={!charity?.logo_url}
		src={charity?.logo_url ?? charity?.icon_url}
		alt="{charity?.name} logo"
	/>
	<div class="flex-1">
		<h3 class="font-medium {titleSize} leading-tight {titleMargin}">
			{charity?.name}
		</h3>
		<span class="block text-gray-500 break-words leading-none w-full">
			{#if url}
				{url?.hostname?.replace(/^wwww*\./i, '') +
					url?.pathname?.replace(/\/$/, '')}
				<!-- some erroneously have wwww.-->
			{:else if charity?.city && charity?.state}
				<span class="capitalize">{charity?.city.toLocaleLowerCase()}</span>,
				<span class="uppercase">{charity.state}</span>
			{:else}
				EIN: {charity?.ein}
			{/if}
		</span>
	</div>
	<slot />
</svelte:element>
