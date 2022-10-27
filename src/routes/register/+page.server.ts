import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, redirect } from '@sveltejs/kit';
import type { Nonprofit } from 'types/change';
import type { Actions } from './$types';

const getValues = (formData: FormData) => ({
	percentage: +(formData.get('percentage') as string)/100,
	email: formData.get('email') as string,
	firstName: formData.get('first-name') as string,
	lastName: formData.get('last-name') as string,
	designated: JSON.parse(formData.get('designated') as string || '[]') as Nonprofit[],
	token: formData.get('token') as string
})

export const actions: Actions = {
	async send(event) {
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const values = getValues(await request.formData())
		const email = values.email

		const { data: emailExists, error: checkEmailError } = await supabaseClient.rpc('email_exists', { email }).single()
		if (checkEmailError) {
            return invalid(500, {
				error: 'Something went wrong. Please try again later.',
				values
			})
        } else if (emailExists) {
			return invalid(500, {
				error: 'That email is already in use. Try another.',
				values
			})
		}
		
		const { error: signInError } = await supabaseClient.auth.signInWithOtp({
			email,
			options: {
            	shouldCreateUser: true
			}
		})
        if (signInError) {
            return invalid(500, {
				error: 'Server error. Try again later.',
				values
			});
        }
		
		return {
			type: 'success',
			values
		}
	},
    async create(event) {
        const { request, url } = event;
        const { supabaseClient } = await getSupabase(event);
		const values = getValues(await request.formData())

        const { error: verifyError } = await supabaseClient.auth.verifyOtp({
			email: values.email,
			token: values.token,
			type: 'magiclink'
		})
        if (verifyError) {
            return invalid(500, {
				error: 'Could not verify one-time code. Try again.',
				values
			});
        }
		
		const { data: { user } } = await supabaseClient.auth.getUser()
		await Promise.allSettled([
			supabaseClient.from('profiles').upsert({
				user_id: user!.id,
				first_name: values.firstName,
				last_name: values.lastName,
				percentage: values.percentage
			}),
			supabaseClient.from('designated').delete().eq('user_id', user!.id)
				.then(() => supabaseClient.from('designated').insert(
					values.designated.map(c => ({
						change_id: c.id,
						user_id: user!.id
					}))
				))
		])
		
		throw redirect(303, '/dashboard')
    }
};