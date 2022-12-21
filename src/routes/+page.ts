import { withLoadNoAuth } from '~/lib/auth'
import type { PageLoad } from './$types'

export const prerender = true

export const load = withLoadNoAuth<PageLoad>(() => ({
	meta: {
		title: 'Donate a part of your bank account to charity every month',
		description: `Tenth is a platform enabling you to automatically donate a percentage of your bank account to charity every year`
	}
}))
