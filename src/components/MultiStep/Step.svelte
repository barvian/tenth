<script lang="ts">
	import { getContext } from 'svelte-typed-context'
    import key from './key'

    export let as = 'fieldset'

    const context = getContext(key)
    if (!context) {
        throw new Error('Step components cannot be rendered outside the MultiStep component')
    }
    const { step, steps } = context
    
	let i = $steps++
    $: active = $step === i
</script>

<svelte:element this={as} class="transition-all duration-300 ease-in-out flex flex-col items-center justify-center" class:opacity-0={!active} class:pointer-events-none={!active} class:-translate-x-[20vw]={$step > i} class:translate-x-[20vw]={$step < i}>
    <slot {active} />
</svelte:element>