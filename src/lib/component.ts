import { onMount, SvelteComponentTyped } from 'svelte'
import { readable } from 'svelte/store'

export const mounted = readable(false, (set) => {
	onMount(() => {
		set(true)
		return () => {
			set(false)
		}
	})
})

export type Props<T> = T extends SvelteComponentTyped<infer P, any, any>
	? P
	: never
