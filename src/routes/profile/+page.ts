import { withLoadAuth } from '~/lib/auth'
import type { PageLoad } from './$types'

export const load = withLoadAuth<PageLoad>(() => ({
	meta: {
		title: 'Your profile',
		description: `Manage your profile on Tenth`
	}
}))
