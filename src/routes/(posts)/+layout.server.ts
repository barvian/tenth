import { dev } from '$app/environment'
import type { LayoutServerLoad } from './$types'

export const prerender = true

export const load: LayoutServerLoad = async (event) => {
	const { metadata } = await import(
		/* @vite-ignore */
		dev
			? `.${event.url.pathname}/+page.md`
			: `.${event.url.pathname}/_page.md.js`
	)
	return { meta: metadata }
}
