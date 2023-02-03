<script lang="ts">
	import { getMultiStep } from './MultiStep.svelte'

	let cls = ''
	export { cls as class }

	export let as = 'div'

	const multiStep = getMultiStep()
	if (!multiStep) {
		throw new Error(
			'Step components cannot be rendered outside the MultiStep component'
		)
	}
	const { step, steps } = multiStep

	let i = $steps++
	$: active = $step === i
</script>

<svelte:element
	this={as}
	class="overlap-item transition-all duration-300 ease-in-out flex flex-col items-center justify-center {cls}"
	class:opacity-0={!active}
	class:pointer-events-none={!active}
	class:-translate-x-[20vw]={$step > i}
	class:translate-x-[20vw]={$step < i}
>
	<slot {active} />
</svelte:element>
