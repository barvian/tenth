import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { withLoadAuth } from '~/lib/auth'
import type { PageServerLoad } from './$types'

export const load = withLoadAuth<PageServerLoad>(async (event) => {
	const { supabaseClient } = await getSupabase(event)

	const { data: tips, error } = await supabaseClient
		.from('tips')
		.select('ytd')
		.single()
	if (error) throw error

	return {
		meta: {
			title: 'Leave a tip',
			description: `Support the development of Tenth with a one-time or monthly tip`
		},
		ytd: tips.ytd
	}
})
