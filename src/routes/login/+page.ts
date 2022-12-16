import { withLoadNoAuth } from '~/lib/auth'
import type { PageLoad } from './$types'

export const load = withLoadNoAuth<PageLoad>(() => ({
	meta: {
		title: 'Login',
		description: `Sign in to the Tenth Dashboard to manage your monthly donations and selected charities`
	}
}))
