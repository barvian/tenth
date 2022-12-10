<script lang="ts">
    import { beforeNavigate, goto as skGoto } from '$app/navigation';
    import { setContext } from 'svelte-typed-context';
    import { writable } from 'svelte/store';
    import key from './key';
	
    export let inconspicuous = true
    export let leaveAlert: string | undefined = undefined
	let step = 0, furthest = 0, steps = writable(0), navigating = false, done = false, progressBar: HTMLElement | undefined
	
    export const getStep = () => step
    const goto = (s: number) => {
        if (s < 0 || $steps-1 < s) return
        navigating = true
        skGoto('', { replaceState: s <= step, state: { step: s }})
        navigating = false
        if (s > furthest) furthest = s
        step = s
    }
	export const next = () => goto(step+1)
	export const prev = () => goto(step-1)
    export const reset = () => furthest = step
    export const complete = () => /*new Promise(resolve => {
        progressBar?.addEventListener('transitionend', resolve, { once: true })*/
        done = true
    // })

    beforeNavigate(({ cancel, delta, from, to }) => {
        if (navigating) {} // we initiated this event, so ignore
        else if (delta === -1) prev()
        else if (delta === 1 && step+1 <= furthest) next()
        else if (from?.url.pathname === to?.url.pathname) goto(0) // navigating to the same page, reset
        else if (step > 0 && from?.url.href !== to?.url.href && !done && leaveAlert && !confirm(leaveAlert)) cancel()
    })

    function handleBeforeUnload(event: BeforeUnloadEvent) {
        if (leaveAlert && step > 0 && !done) {
            event.preventDefault()
            return event.returnValue = leaveAlert
        }
    }

    let stepStore = writable<number>()
    $: $stepStore = step
	
	setContext(key, {
		step: stepStore,
        steps,
		next,
		prev,
        reset
	})
</script>

<svelte:window on:beforeunload={handleBeforeUnload} />

<div bind:this={progressBar} class="fixed top-0 left-0 w-full h-[3px] bg-black origin-left transition-transform duration-300 z-50" style="transform: scaleX({(done ? 1 : inconspicuous ? step / $steps : $steps === 0 ? 0 : (step+1) / ($steps+1)) || 0})" />

<div class="overlap">
    <slot {next} {prev} {reset} />
</div>