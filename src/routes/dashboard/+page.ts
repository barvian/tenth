import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'
import type { Institution } from 'plaid'
import { withLoadAuth } from '~/lib/auth'
import type { Designation } from '~/lib/db'
import { parseJSON } from '~/lib/fetch'
import type { PageLoad } from './$types'
import type { Organization } from '/types/pledge'

export const load = withLoadAuth<PageLoad>(async (event) => {
	const { supabaseClient } = await getSupabase(event)
	const parent = await event.parent()

	// Redirect if linking process isn't complete
	if (!parent.profile?.plaid_access_token) throw redirect(303, '/link')

	const institution = await event
		.fetch(
			`/api/plaid/institutions/${parent.profile.plaid_institution_id}.json`
		)
		.then((r) => parseJSON<Institution>(r))

	const { data } = await supabaseClient
		.from('designated')
		.select('pledge_id, weight')
		.order('created_at', { ascending: true })
	event.depends('supabase:designated')

	let designated: Designation[] = []
	if (data?.length) {
		designated = await Promise.all(
			data.map(async (row) => ({
				organization: await event
					.fetch(`/api/pledge/organizations/${row.pledge_id}.json`)
					.then((r) => parseJSON<Organization>(r)),
				weight: row.weight
			}))
		)
	}

	return {
		meta: {
			title: 'Dashboard',
			description: `Manage your donation amount, designated charities, and bank account on Tenth`
		},
		institution,
		designated
	}
})
