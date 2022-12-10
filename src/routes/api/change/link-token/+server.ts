import { SECRET_CHANGE_KEY } from '$env/static/private';
import { PUBLIC_CHANGE_KEY } from '$env/static/public';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    const { session, supabaseClient } = await getSupabase(event)
    if (!session) throw error(403, 'No user logged in')

	const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('change_id').single()
	if (profileError || !profile?.change_id) throw error(500, 'Could not retrieve change_id for logged in user')
	
	const creds = Buffer.from(PUBLIC_CHANGE_KEY+':'+SECRET_CHANGE_KEY).toString('base64')
	const res = await fetch(`https://api.getchange.io/api/v1/accounts/${profile.change_id}/link_bank_token`, {
        method: 'POST',
		headers: {
			'Authorization': `Basic ${creds}`,
			'Content-Type': 'application/json'
		}
	}).then(async r => r.ok ? r.json() : Promise.reject(r))

	return json(res)
}
