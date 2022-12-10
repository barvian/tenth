import { readable } from "svelte/store";
import { onMount, afterUpdate as svelteAfterUpdate, tick } from 'svelte';

export const mounted = readable(false, set => {
    onMount(() => {
        set(true)
        return () => { set(false) }
    })
})

// Allow filtering afterUpdate by changed deps, similar to React's useEffect
// https://svelte.dev/repl/0c9cd8c29c5043eea89bd9c6eb4f279a?version=3.42.6
export function afterUpdate(fn: () => any, get_deps: (() => any[]) | undefined) {
    if (!get_deps) return svelteAfterUpdate(fn)
    
	let previous: any[] = []
	svelteAfterUpdate(async () => {
		const deps = get_deps()
		if (deps.some((dep, i) => dep !== previous[i])) {
			await tick()
			fn()
			previous = deps
		}
	})
}