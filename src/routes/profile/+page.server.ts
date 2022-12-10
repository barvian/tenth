import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { createClient } from '@supabase/supabase-js';
import { invalid, redirect } from '@sveltejs/kit';
import stripeClient from '~/lib/stripe';
import type { Actions } from './$types';

export const actions: Actions = {
    async update(event) {
        const { request } = event;
        const { supabaseClient } = await getSupabase(event);

        const formData = await request.formData();
        const email = formData.get('email') as string;

        const { error } = await supabaseClient.auth.updateUser({ email })
        if (error) {
            return invalid(500, {
				error: 'Server error. Try again later.',
                values: { email }
			});
        }

        return { success: true }
    },
    async delete(event) {
        const { session, supabaseClient } = await getSupabase(event)
        const supabaseServiceRoleClient = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

        const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('stripe_id').single()
        if (profileError) {
            return invalid(500, {
				error: 'Server error. Try again later.'
			})
        } else if (profile.stripe_id) {
            try {
                await stripeClient.customers.del(profile.stripe_id)
            } catch (e) {
                return invalid(500, {
                    error: 'Could not delete account. Try again later.'
                })
            }
        }

        await supabaseClient.auth.signOut()

        const { error } = await supabaseServiceRoleClient.auth.admin.deleteUser(session?.user.id!)        
        if (error) return invalid(500, {
            error: 'Could not delete account. Try again later.'
        })

        throw redirect(303, '/')
    }
}