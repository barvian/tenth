<script lang="ts">
    import { mounted } from '~/lib/component'
    import Arrow from './icons/Arrow.svelte'
    import Shadow from './Shadow.svelte';

    export let flipped = false
    export let backAction: string
    export let backValidate = false
    // export let complete = false

    const updateFlipping = () => $mounted
    // @ts-ignore flipped triggers reactive statement but its value is unused
    $: flipping = (flipped, updateFlipping())
</script>

<div class="flipcard relative round-2xl perspective-1400 w-[425px]" on:animationend={() => flipping = false}>
    <Shadow class="top-1 left-1 -bottom-4 -right-4 clip-[inset(0_theme(space.3)_theme(space.2)_0_round_var(--round))] {flipping ? 'animate-flipcard-shadow' : ''}" />
    <div class="overlap transform-3d motion-safe:transition-transform motion-safe:duration-[600ms]" class:rotate-y-[-180deg]={flipped}>
        <div class="backface-hidden bg-white relative motion-safe:transition-transform duration-[600ms] rounded p-10 border" class:translate-z-1={flipped}>
            <slot name="front" />
        </div>
        <div class="backface-hidden bg-white relative rounded p-10 border rotate-y-180">
            <div class="absolute transition-[clip-path] inset-0 rounded border-t-primary border-t-4 clip-[inset(0_50%_0_0)]" />
            <button formaction={backAction} formnovalidate={!backValidate} type="submit" class="absolute top-6 left-5"><Arrow class="h-4 transition-transform hover:-translate-x-0.5" /></button>
            <slot name="back" />
            <div role="presentation" class="motion-reduce:hidden shade absolute transition-opacity duration-[600ms] pointer-events-none inset-0 bg-gradient-to-r from-black/30 to-black/60" class:opacity-0={flipped} />
        </div>
    </div>
</div>