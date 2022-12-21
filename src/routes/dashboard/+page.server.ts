import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { error, redirect } from '@sveltejs/kit'
import { success } from '~/lib/actions'
import { withLoadAuth } from '~/lib/auth'
import type { Actions, PageServerLoad } from './$types'

export const load = withLoadAuth<PageServerLoad>(async (event) => {
	const { supabaseClient } = await getSupabase(event)
	const parent = await event.parent()

	// Redirect if linking process is incomplete
	if (!parent.profile?.plaid_institution_id || !parent.profile?.stripe_linked)
		throw redirect(303, '/link')

	const institution = await event
		.fetch(
			`/api/plaid/institutions/${parent.profile.plaid_institution_id}.json`
		)
		.then((r) => (r.ok ? r.json() : Promise.reject(r.text())))

	const { data: change_ids } = await supabaseClient
		.from('designated')
		.select('change_id')
		.order('created_at', { ascending: true })
	let designated
	if (change_ids?.length) {
		designated = await Promise.all(
			change_ids.map((row) =>
				event
					.fetch(`/api/change/charities/${row.change_id}.json`)
					.then((r) => (r.ok ? r.json() : Promise.reject(r)))
			)
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
	async 'update-percentage'(event) {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const data = await request.formData()

		const { error: updateError } = await supabaseClient
			.from('profiles')
			.update({
				percentage: +(data.get('percentage') as string)
			})
			.eq('user_id', session.user.id)
		if (updateError) throw updateError

		return success(data)
	},
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
