<script lang="ts">
	import { clsx, type ClassValue } from 'clsx'

	let cls: ClassValue = undefined
	export { cls as class }
</script>

<p class={clsx([cls, 'p-3 pt-2.5 text-gray-500'])}>
	<slot />
</p>
