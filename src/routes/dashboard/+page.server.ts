import { PUBLIC_CHANGE_KEY } from '$env/static/public'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error } from '@sveltejs/kit'
import { getValues, success } from '~/lib/actions'
import type { Nonprofit, NonprofitSearchResults } from '~/lib/change'
import { getSelf, SELF_CHANGE_ID } from '~/lib/change'
import { parseJSON } from '~/lib/fetch'
import type { Actions } from './$types'

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

		const nonprofits: Nonprofit[] = []
		if ('tenth'.startsWith(q.trim().toLowerCase()))
			nonprofits.push(getSelf(event.url))

		const response = await fetch(
			`https://api.getchange.io/api/v1/nonprofits?` +
				new URLSearchParams({
					public_key: PUBLIC_CHANGE_KEY,
					search_term: q,
					limit: SEARCH_RESULTS_LIMIT.toString()
				})
		).then((r) => parseJSON<NonprofitSearchResults>(r))
		nonprofits.push(...response.nonprofits)

		return success(formData, nonprofits)
	},
	async 'add-charity'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()
		const change_id = formData.get('change_id') as string

		let weight
		// Default self to 1% weight
		if (change_id === SELF_CHANGE_ID) {
			const { data: designated } = await supabaseClient
				.from('designated')
				.select('weight')
			if (designated && designated.length > 0) {
				// ignore errors
				const totalWeight = designated.reduce((total, d) => total + d.weight, 0)
				weight = Math.max(0.01 * totalWeight, 0.01)
			}
		}

		const { error: insertError } = await supabaseClient
			.from('designated')
			.insert({
				change_id,
				weight
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
