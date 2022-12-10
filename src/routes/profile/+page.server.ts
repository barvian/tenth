import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { invalid } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    async default(event) {
        const { request } = event;
        const { supabaseClient } = await getSupabase(event);

        const formData = await request.formData();
        const email = formData.get('email') as string;

        const { error } = await supabaseClient.auth.updateUser({ email })
        if (error) {
            return invalid(500, {
				error: 'Server error. Try again later.'
			});
        }

        return { success: true }
    }
};