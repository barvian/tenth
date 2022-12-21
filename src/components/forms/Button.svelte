<script lang="ts">
	import { browser } from '$app/environment'
	import clsx from 'clsx'
	import { getForm } from './Form.svelte'
	import Spinner from '../icons/Spinner.svelte'
	import omit from 'lodash/omit'

	const form = getForm()
	const formHasUniqueId = form?.hasUniqueId
	const formLoading = form?.loading
	const formInvalids = form?.invalid

	export let as = 'button'
	export let href: string | null | undefined = null
	export let formaction: string | undefined = undefined
	export let name: string | undefined = undefined
	export let value: string | null | undefined = undefined
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

	$: if (formaction && form && !$formHasUniqueId) {
		throw new Error(
			'<Form /> must have a unique ID if it contains buttons with formactions'
		)
	}
</script>

<svelte:element
	this={href ? 'a' : as}
	{href}
	disabled={loading ||
		disabled ||
		$formLoading ||
		(browser &&
			$formInvalids &&
			Object.keys(name ? omit($formInvalids, name) : $formInvalids).length > 0)}
	{type}
	{name}
	{value}
	on:click
	{formaction}
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
	<span class="block w-full" class:invisible={loading || $formLoading}
		><slot /></span
	>
	{#if loading || $formLoading}<Spinner class="h-5" />{/if}
</svelte:element>
