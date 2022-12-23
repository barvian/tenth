<script lang="ts">
	import { clsx, type ClassValue } from 'clsx'

	let cls: ClassValue = undefined
	export { cls as class }
</script>

<hr class={clsx([cls, 'border-gray-200 my-2'])} />
