<script lang="ts">
	import Spinner from './icons/Spinner.svelte'
	import clsx from 'clsx'

	export let as = 'button'
	export let href: string | null | undefined = null
	export let type = 'button'
	export let loading = false
	export let disabled = false
	export let unstyled = false
	export let bg = 'bg-black disabled:bg-gray-200'
	export let color = 'text-white'
	export let shadow: string | boolean =
		'not-disabled:shadow not-disabled:hover:-translate-y-1 not-disabled:hover:shadow-elevated not-disabled:active:shadow not-disabled:active:translate-y-0'
	export let rounded = 'rounded-2xl'
	export let padding = 'px-6 py-4'
	export let width = 'w-full'
	export let textSize = 'text-lg'
	export let align = 'text-center'
	export let font = 'font-medium'
	let cls = ''
	export { cls as class }
</script>

<svelte:element
	this={href ? 'a' : as}
	{href}
	disabled={loading || disabled}
	{type}
	on:click
	class={clsx(
		cls,
		'overlap-inline items-center justify-items-center',
		!unstyled && [
			width,
			bg,
			color,
			align,
			shadow,
			padding,
			rounded,
			textSize,
			font,
			width,
			'whitespace-nowrap transition-all active:transition-none'
		]
	)}
>
	<span class="block w-full" class:invisible={loading}><slot /></span>
	{#if loading}<Spinner class="h-5" />{/if}
</svelte:element>
