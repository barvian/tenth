import { PUBLIC_CHANGE_KEY } from '$env/static/public'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, redirect } from '@sveltejs/kit'
import type { Institution } from 'plaid'
import type { Nonprofit, NonprofitSearchResults } from 'types/change'
import { getValues, success } from '~/lib/actions'
import { withLoadAuth } from '~/lib/auth'
import type { Designation } from '~/lib/db'
import { parseJSON } from '~/lib/fetch'
import type { Actions, PageServerLoad } from './$types'

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

const SEARCH_RESULTS_LIMIT = 10

export const actions: Actions = {
	async 'update-percentage'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()

		const { error: updateError } = await supabaseClient
			.from('profiles')
			.update({
				percentage: +(formData.get('percentage') as string)
			})
			.eq('user_id', session.user.id)
		if (updateError) throw updateError

		return success(formData)
	},
	async 'update-split'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()

		// omit the internal fields and convert the form data to an object
		const split = getValues(formData)
		const length = Object.keys(split).length

		const { error: updateError } = await supabaseClient
			.from('designated')
			.upsert(
				Object.keys(split).map((change_id) => ({
					user_id: session.user.id,
					change_id,
					weight: (+split[change_id] / 100) * length
				}))
			)
		if (updateError) throw updateError

		// Don't return the split values, they'll get updated by the load
		return success(formData, null, { omit: Object.keys(split) })
	},
	async 'search-charity'(event) {
		const { request } = event
		const formData = await request.formData()

		const q = formData.get('q') as string
		// Change will actually return featured charities if you don't
		// pass a search term. This disables that behavior.
		if (!q.trim()) return success(formData)

		const response = await fetch(
			`https://api.getchange.io/api/v1/nonprofits?` +
				new URLSearchParams({
					public_key: PUBLIC_CHANGE_KEY,
					search_term: q,
					limit: SEARCH_RESULTS_LIMIT.toString()
				})
		).then((r) => parseJSON<NonprofitSearchResults>(r))

		return success(formData, response.nonprofits)
	},
	async 'add-charity'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()

		const { error: insertError } = await supabaseClient
			.from('designated')
			.insert({
				change_id: formData.get('change_id') as string
			})
		if (insertError) throw insertError

		// Clear the query if success, but not with omit
		// because then the Input wouldn't show it
		formData.set('q', '')
		return success(formData)
	},
	async 'remove-charity'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()
		const id = formData.get('id') as string

		const { error: deleteError } = await supabaseClient
			.from('designated')
			.delete()
			.eq('change_id', id)
		if (deleteError) throw deleteError

		return success(formData)
	}
}
