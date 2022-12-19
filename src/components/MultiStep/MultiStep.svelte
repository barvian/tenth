<script lang="ts" context="module">
	import type { Writable } from 'svelte/store'
	import { getContext, type InjectionKey } from 'svelte-typed-context'

	const key: InjectionKey<{
		step: Writable<number>
		steps: Writable<number>
		next: () => void
		prev: () => void
		reset: () => void
	}> = Symbol()

	export const getMultiStep = () => getContext(key)
</script>

<script lang="ts">
	import { beforeNavigate, goto as skGoto } from '$app/navigation'
	import { setContext } from 'svelte-typed-context'
	import { writable } from 'svelte/store'

	export let inconspicuous = true
	export let leaveAlert: string | undefined = undefined
	let step = writable(0),
		furthest = 0,
		steps = writable(0),
		navigating = false,
		done = false,
		progressBar: HTMLElement | undefined

	export const getStep = () => $step
	const goto = (s: number) => {
		if (s < 0 || $steps - 1 < s) return
		navigating = true
		skGoto('', { replaceState: s <= $step, state: { step: s } })
		navigating = false
		if (s > furthest) furthest = s
		$step = s
	}
	export const next = () => goto($step + 1)
	export const prev = () => goto($step - 1)
	export const reset = () => (furthest = $step)
	export const complete = () =>
		/*new Promise(resolve => {
        progressBar?.addEventListener('transitionend', resolve, { once: true })*/
		(done = true)
	// })

	beforeNavigate(({ cancel, delta, from, to }) => {
		if (navigating) {
		} // we initiated this event, so ignore
		else if (delta === -1) prev()
		else if (delta === 1 && $step + 1 <= furthest) next()
		else if (from?.url.pathname === to?.url.pathname)
			goto(0) // navigating to the same page, reset
		else if (
			$step > 0 &&
			from?.url.href !== to?.url.href &&
			!done &&
			leaveAlert &&
			!confirm(leaveAlert)
		) {
			cancel()
		}
	})

	function handleBeforeUnload(event: BeforeUnloadEvent) {
		if (leaveAlert && $step > 0 && !done) {
			event.preventDefault()
			return (event.returnValue = leaveAlert)
		}
	}

	// prettier-ignore
	$: width =
		(done
			? 1
			: inconspicuous
				? $step / $steps
				: $steps === 0
					? 0
					: ($step + 1) / ($steps + 1)) || 0

	setContext(key, {
		step,
		steps,
		next,
		prev,
		reset
	})
</script>

<svelte:window on:beforeunload={handleBeforeUnload} />

<div
	bind:this={progressBar}
	class="fixed top-0 left-0 w-full h-[3px] bg-black origin-left transition-transform duration-300 z-50"
	style="transform: scaleX({width})"
/>

<div class="overlap relative">
	<noscript class="block justify-self-center self-center">
		<div class="absolute -inset-4 z-50 bg-white" />
		<div class="relative z-50 rounded-2xl shadow-md border max-w-xl text-center p-8">
			<h2 class="text-3xl font-bold mb-5">
				JavaScript is disabled
			</h2>
			<p class="text-lg text-gray-500">
				JavaScript must be enabled for some parts of this site. Please enable it in your browser settings.
			</p>
		</div>
	</noscript>
	<slot {next} {prev} {reset} />
</div>
