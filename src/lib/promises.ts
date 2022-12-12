import { browser } from "$app/environment"

// Returns a promise with the page loaded status
export const pageLoaded: Promise<boolean> = !browser ? Promise.resolve(false) : new Promise(resolve => {
	if (document.readyState === 'complete') return resolve(true)
	window.addEventListener('load', event => {
		resolve(true)
	})
})

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
