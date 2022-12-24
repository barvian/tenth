<script lang="ts">
	import { clsx, type ClassValue } from 'clsx'

	let cls: ClassValue = undefined
	export { cls as class }
</script>

<p class={clsx(cls, 'px-3 py-2 text-gray-500')}>
	<slot />
</p>
