import { SECRET_CHANGE_KEY } from '$env/static/private'
import { PUBLIC_CHANGE_KEY } from '$env/static/public'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { invalid } from '@sveltejs/kit'
import type { Actions } from './$types'
const changeCreds = Buffer.from(PUBLIC_CHANGE_KEY+':'+SECRET_CHANGE_KEY).toString('base64')

export const actions: Actions = {
    default: async (event) => {
        const { request } = event
        const { supabaseClient } = await getSupabase(event)
        const formData = await request.formData()
        
        try {
            const changeRequest = await fetch('https://api.getchange.io/api/v1/nonprofit_requests', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${changeCreds}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('name') as string,
                    ein: formData.get('ein') as string,
                    address_line: formData.get('address_line') as string,
                    city: formData.get('city') as string,
                    state: formData.get('state') as string,
                    website: formData.get('website') as string,
                    socials: {
                        facebook: formData.get('facebook') as string,
                        twitter: formData.get('twitter') as string,
                        instagram: formData.get('instagram') as string,
                        youtube: formData.get('youtube') as string
                    }
                })
            }).then(r => r.ok ? r.json() : Promise.reject(r))

            await supabaseClient.from('requests').insert({
                change_id: changeRequest.result.id,
                email: formData.get('email') ?? undefined
            })

            return { success: true, values: { email: formData.get('email') } }
        } catch (e) {
            const values: Record<string, string> = {}
            formData.forEach((value, key) => values[key] = value as string)

            return invalid(500, {
				error: 'Could not complete request. Please try again later.',
				values
			})
        }
    }
}