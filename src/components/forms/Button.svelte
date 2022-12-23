<script lang="ts">
	import { browser } from '$app/environment'
	import clsx, { type ClassValue } from 'clsx'
	import Spinner from '../icons/Spinner.svelte'
	import omit from 'lodash/omit'
	import { getFormByIdOrContext } from './Form.svelte'

	export let as = 'button'
	export let href: string | null | undefined = null
	export let formaction: string | undefined = undefined
	export let name: string | undefined = undefined
	export let loading = false
	export let disabled = false
	export let unstyled = false
	export let bg: ClassValue = 'bg-black disabled:bg-gray-300'
	export let color: ClassValue = 'text-white'
	export let shadow: ClassValue =
		'not-disabled:shadow not-disabled:hover:-translate-y-1 not-disabled:hover:shadow-elevated not-disabled:active:shadow not-disabled:active:translate-y-0'
	export let rounded: ClassValue = 'rounded-2xl'
	export let padding: ClassValue = 'px-6 py-4'
	export let width: ClassValue = 'w-full'
	export let textSize: ClassValue = 'text-lg'
	export let align: ClassValue = 'text-center'
	export let font: ClassValue = 'font-medium'
	export let overlap: ClassValue = 'overlap-inline'
	let cls = ''
	export { cls as class }
	let formId: string | undefined = undefined
	export { formId as form }

	$: form = getFormByIdOrContext(formId)
	$: formLoading = form?.loading
	$: formInvalids = form?.invalid
</script>

<svelte:element
	this={href ? 'a' : as}
	{href}
	{...$$restProps}
	disabled={loading ||
		disabled ||
		$formLoading ||
		(browser &&
			$formInvalids &&
			Object.keys(name ? omit($formInvalids, name) : $formInvalids).length > 0)}
	{name}
	on:click
	{formaction}
	form={formId}
	class={clsx(
		cls,
		overlap,
		'items-center justify-items-center',
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
