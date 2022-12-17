import { browser } from '$app/environment'
import { onMount } from 'svelte'
import { readable } from 'svelte/store'

export const mounted = readable(false, (set) => {
	onMount(() => {
		set(true)
		return () => {
			set(false)
		}
	})
})

const loadedScripts: Record<string, boolean> = {}
export const loadScript = (src: string) =>
	// prettier-ignore
	!browser
		? readable(false)
		: loadedScripts[src]
			? readable(true)
			: readable(false, (set) => {
				const script = document.createElement('script')
				script.onload = () => {
					loadedScripts[src] = true
					set(true)
				}
				script.src = src
				document.head.appendChild(script)
			})
