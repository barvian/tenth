import type { LayoutServerLoad } from './$types'
export const prerender = true

export const load: LayoutServerLoad = async (event) => {
	const { metadata } = await import(`..${event.route.id}/+page.md`)
	return { meta: metadata }
}
