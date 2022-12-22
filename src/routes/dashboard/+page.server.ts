import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, redirect } from '@sveltejs/kit'
import type { Institution } from 'plaid'
import type { Nonprofit } from 'types/change'
import { addClientActionsToServer, success } from '~/lib/actions'
import { withLoadAuth } from '~/lib/auth'
import type { Designation } from '~/lib/db'
import { parseJSON } from '~/lib/fetch'
import type { Actions, PageServerLoad } from './$types'
import { update_percentage, update_split } from './actions.client'

export const load = withLoadAuth<PageServerLoad>(async (event) => {
	const { supabaseClient } = await getSupabase(event)
	const parent = await event.parent()

	// Redirect if linking process isn't complete
	if (!parent.profile?.plaid_institution_id || !parent.profile?.stripe_linked)
		throw redirect(303, '/link')

	const institution = await event
		.fetch(
			`/api/plaid/institutions/${parent.profile.plaid_institution_id}.json`
		)
		.then((r) => parseJSON<Institution>(r))

	const { data } = await supabaseClient
		.from('designated')
		.select('change_id, weight')
		.order('created_at', { ascending: true })
	event.depends('supabase:designated')

	let designated: Designation[] = []
	if (data?.length) {
		designated = await Promise.all(
			data.map(async (row) => ({
				nonprofit: await event
					.fetch(`/api/change/charities/${row.change_id}.json`)
					.then((r) => parseJSON<Nonprofit>(r)),
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

export const actions: Actions = {
	...addClientActionsToServer({ update_percentage, update_split }),
	async 'remove-charity'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const data = await request.formData()
		const id = data.get('id') as string

		const { error: deleteError } = await supabaseClient
			.from('designated')
			.delete()
			.eq('change_id', id)
		if (deleteError) throw deleteError

		return success(data)
	}
}
