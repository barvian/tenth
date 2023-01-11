import { PLEDGE_KEY } from '$env/static/private'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error } from '@sveltejs/kit'
import { getValues, success } from '~/lib/actions'
import { parseJSON } from '~/lib/fetch'
import type { Actions } from './$types'
import type { OrganizationSearchResults } from '/types/pledge'

const SEARCH_RESULTS_LIMIT = 10

export const actions: Actions = {
	async 'update-percentage'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()

		const { error: updateError } = await supabaseClient
			.from('users')
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
				Object.keys(split).map((pledge_org_id) => ({
					user_id: session.user.id,
					pledge_org_id,
					weight: (+split[pledge_id] / 100) * length
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
		// Ignore empty queries
		if (!q.trim()) return success(formData)

		const response = await fetch(
			`https://api.pledge.to/v1/organizations?` +
				new URLSearchParams({
					q,
					per_page: SEARCH_RESULTS_LIMIT.toString()
				}),
			{
				headers: { Authorization: `Bearer ${PLEDGE_KEY}` }
			}
		).then((r) => parseJSON<OrganizationSearchResults>(r))

		return success(formData, response.results)
	},
	async 'add-charity'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()

		const { error: insertError } = await supabaseClient
			.from('designated')
			.insert({
				pledge_id: formData.get('pledge_id') as string
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
			.eq('pledge_id', id)
		if (deleteError) throw deleteError

		return success(formData)
	}
}
