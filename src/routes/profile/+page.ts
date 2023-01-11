import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { withLoadAuth } from '~/lib/auth'
import type { PageLoad } from './$types'

export const load = withLoadAuth<PageLoad>(async (event) => {
	const { supabaseClient } = await getSupabase(event)
	const { data, error } = await supabaseClient
		.from('users')
		.select('first_name, last_name')
		.single()
	if (error) throw error

	return {
		first_name: data.first_name,
		last_name: data.last_name,
		meta: {
			title: 'Your profile',
			description: `Manage your profile on Tenth`
		}
	}
})
