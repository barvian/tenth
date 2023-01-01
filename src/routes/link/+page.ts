import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { Institution } from 'plaid'
import { withLoadAuth } from '~/lib/auth'
import { parseJSON } from '~/lib/fetch'
import type { PageLoad } from './$types'

export const load = withLoadAuth<PageLoad>(async (event) => {
	const meta = {
		title: 'Link a bank',
		description: `Link your bank account with Tenth to complete the set-up process`
	}

	const { session } = await getSupabase(event)
	if (!session) return { meta }
	const parent = await event.parent()

	let institution: any
	if (parent.profile?.plaid_institution_id) {
		institution = await event
			.fetch(
				`/api/plaid/institutions/${parent.profile.plaid_institution_id}.json`
			)
			.then((r) => parseJSON<Institution>(r))
	}

	return {
		meta,
		institution
	}
})
