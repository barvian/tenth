import type { Writable } from 'svelte/store'
import type { InjectionKey } from 'svelte-typed-context'

const key: InjectionKey<{
	step: Writable<number>
	steps: Writable<number>
	next: () => void
	prev: () => void
	reset: () => void
}> = Symbol()
export default key
