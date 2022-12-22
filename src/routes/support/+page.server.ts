import { compile } from 'mdsvex'
import faqs from '~/../data/faqs.yml'
import type { PageServerLoad } from './$types'

export const prerender = true

export const load: PageServerLoad = async () => ({
	meta: {
		title: 'Support',
		description: `Find help and support for Tenth`
	},
	faqs: await Promise.all(
		faqs.map(async ({ q, a }: { q: string; a: string }) => ({
			q,
			a: (await compile(a))?.code
		}))
	)
})
