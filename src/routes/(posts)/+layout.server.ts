import { dev } from '$app/environment'
import type { LayoutServerLoad } from './$types'
export const prerender = true

export const load: LayoutServerLoad = async (event) => {
	const { metadata } = await import(
		dev ? `..${event.route.id}/+page.md` : `..${event.route.id}/_page.md.js`
	)
	return { meta: metadata }
}
