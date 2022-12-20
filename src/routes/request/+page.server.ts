import { SECRET_CHANGE_KEY } from '$env/static/private'
import { PUBLIC_CHANGE_KEY } from '$env/static/public'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { success } from '~/lib/actions'
import type { Actions } from './$types'
const changeCreds = Buffer.from(
	PUBLIC_CHANGE_KEY + ':' + SECRET_CHANGE_KEY
).toString('base64')

export const actions: Actions = {
	default: async (event) => {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)
		const data = await request.formData()

		const changeRequest = await fetch(
			'https://api.getchange.io/api/v1/nonprofit_requests',
			{
				method: 'POST',
				headers: {
					Authorization: `Basic ${changeCreds}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: data.get('name') as string,
					ein: data.get('ein') as string,
					address_line: data.get('address_line') as string,
					city: data.get('city') as string,
					state: data.get('state') as string,
					website: data.get('website') as string,
					socials: {
						facebook: data.get('facebook') as string,
						twitter: data.get('twitter') as string,
						instagram: data.get('instagram') as string,
						youtube: data.get('youtube') as string
					}
				})
			}
		).then((r) => (r.ok ? r.json() : Promise.reject(r.text())))

		await supabaseClient.from('requests').insert({
			// ignore errors
			change_id: changeRequest.result.id,
			email: data.get('email') ?? undefined
		})

		return success(data)
	}
}
