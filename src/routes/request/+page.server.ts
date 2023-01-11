import { PLEDGE_KEY } from '$env/static/private'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { invalid, success } from '~/lib/actions'
import { parseJSON } from '~/lib/fetch'
import type { Actions } from './$types'
import type { OrganizationRequestResponse } from '/types/pledge'

export const actions: Actions = {
	default: async (event) => {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)
		const data = await request.formData()

		const pledgeRequest = await fetch(
			'https://api.pledge.to/v1/organizations',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${PLEDGE_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					ngo_id: data.get('ngo_id') as string
				})
			}
		).then((r) => parseJSON<OrganizationRequestResponse>(r))

		if (pledgeRequest?.message) {
			return invalid(403, data, { ngo_id: pledgeRequest.message[0] })
		}

		await supabaseClient.from('requests').insert({
			// ignore errors
			ngo_id: data.get('ngo_id') as string,
			email: data.get('email') ?? undefined
		})

		return success(data)
	}
}
