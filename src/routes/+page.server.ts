import { SECRET_CHANGE_KEY } from '$env/static/private';
import { PUBLIC_CHANGE_KEY } from '$env/static/public';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, redirect } from '@sveltejs/kit';
import type stripe from 'stripe';
import { ChangeAccountCreationError } from '~/lib/change';
import stripeClient from '~/lib/stripe';
import type { Actions, PageServerLoad } from './$types';
const changeCreds = Buffer.from(PUBLIC_CHANGE_KEY+':'+SECRET_CHANGE_KEY).toString('base64')

export const load: PageServerLoad = async (event) => {
	const { supabaseClient, session } = await getSupabase(event)
    if (!session) return

	// Check if the Stripe customer is fully configured (aka the linking process is complete)
	const { data: profile, error: profileError } = await supabaseClient.from('profiles').select(
		'stripe_id, plaid_institution_id, plaid_account_mask, percentage'
	).single()
	if (!profile?.plaid_institution_id) throw redirect(303, '/link')
	if (profile?.stripe_id) {
		const stripeCustomer = await stripeClient.customers.retrieve(profile?.stripe_id)
		if (!stripeCustomer?.default_source) throw redirect(303, '/link')
	} else throw profileError

	const institution = await event.fetch(`/api/plaid/institutions/${profile?.plaid_institution_id}.json`)
		.then(r => r.ok ? r.json() : Promise.reject(r))
        
	return {
		profile: { 
			plaid_institution_id: profile.plaid_institution_id,
			plaid_account_mask: profile.plaid_account_mask,
			percentage: profile.percentage
		},
		institution
	}
}

const getValues = (formData: FormData) => ({
	percentage: +(formData.get('percentage') as string),
	email: formData.get('email') as string,
	firstName: formData.get('first-name') as string,
	lastName: formData.get('last-name') as string,
	designated: JSON.parse(formData.get('designated') as string || '[]') as string[],
	token: formData.get('token') as string
})

export const actions: Actions = {
    async register(event) {
        const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const values = getValues(await request.formData())
		
        const { error: verifyError } = await supabaseClient.auth.verifyOtp({
			email: values.email,
			token: values.token,
			type: 'magiclink'
		})
        if (verifyError) return invalid(401, { values })
		
		let stripeCustomer: stripe.Customer | undefined, changeAccount
		try {
			stripeCustomer = await stripeClient.customers.create()

			changeAccount = await fetch('https://api.getchange.io/api/v1/accounts', {
				method: 'POST',
				headers: {
					'Authorization': `Basic ${changeCreds}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: values.email,
					name: `${values.firstName} ${values.lastName}`
				})
			}).then(async r => {
				if (r.ok) return r.json()
				throw new ChangeAccountCreationError(await r.text())
			})
			console.log(`Created change account for ${values.email}`, changeAccount)

			const { error: registerError } = await supabaseClient.rpc('register', {
				stripe_id: stripeCustomer.id,
				change_id: changeAccount.id,
				first_name: values.firstName,
				last_name: values.lastName,
				percentage: values.percentage,
				designated: values.designated
			})
			if (registerError) throw registerError
		} catch (e) {
			if (e instanceof ChangeAccountCreationError) {
				console.error('Could not create Change account for email %s', values.email, e)
			} else {
				console.error('Registration failed for email %s', values.email, e)
			}

			await supabaseClient.auth.signOut()
			
			if (stripeCustomer) await stripeClient.customers.del(stripeCustomer.id).catch(e => null)
			
			return invalid(500, { values })
		}

		throw redirect(303, '/link') // This has to be out here because otherwise it would be caught
    }
};