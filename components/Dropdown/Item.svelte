<script lang="ts">
	import { clsx, type ClassValue } from 'clsx'
	import Button from '../forms/Button.svelte'

	let cls: ClassValue = undefined
	export { cls as class }
</script>

<Button
	role="menuitem"
	unstyled
	class={clsx(
		cls,
		'not-disabled:hover:bg-gray-100 p-3 text-base font-normal leading-tight rounded-xl w-full text-left'
	)}
	overlap="overlap"
	{...$$restProps}
>
	<slot />
</Button>
