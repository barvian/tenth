import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	async send(event) {
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);

		const formData = await request.formData();
		const email = formData.get('email') as string;

		const { error } = await supabaseClient.auth.signInWithOtp({ email, options: {
            shouldCreateUser: false
        }})
        if (error) {
            return invalid(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			});
        }

		return { type: 'success', values: { email } }
	},
    async verify(event) {
        const { request } = event;
        const { supabaseClient } = await getSupabase(event);

        const formData = await request.formData();
        const email = formData.get('email') as string;
        const token = formData.get('token') as string;

        const { error } = await supabaseClient.auth.verifyOtp({ email, token, type: 'magiclink' })
		console.log('did something happen', error)
        if (error) {
            return invalid(500, {
				error: 'Server error. Try again later.',
				values: {
					email, token
				}
			});
        }

		throw redirect(303, '/dashboard')
    }
};