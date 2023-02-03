<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import clsx, { type ClassValue } from 'clsx'
	import { clickOutside, escape } from '~/lib/actions'

	let cls: ClassValue = undefined
	export { cls as class }
	export let summaryClass: ClassValue = undefined
	export let open = false
	export let menuClass: ClassValue = undefined

	afterNavigate(() => (open = false))
</script>

<details
	class={clsx('group relative inline-block', cls)}
	bind:open
	use:clickOutside
	use:escape
	on:outclick={() => (open = false)}
	on:escape={() => (open = false)}
>
	<summary class={clsx(summaryClass)} aria-haspopup="menu">
		<slot name="summary" />
	</summary>
	<div
		class={clsx(
			menuClass,
			'rounded-2xl text-left border p-2 z-50 bg-white right-0 absolute top-full shadow-md animate-fly-b'
		)}
		role="menu"
	>
		<slot />
	</div>
</details>
