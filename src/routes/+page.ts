import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
    const { supabaseClient, session } = await getSupabase(event)
    if (session) {
        const { data: profile } = await supabaseClient.from('profiles').select(
            'plaid_institution_id, plaid_account_mask'
        ).single()
        if (!profile?.plaid_institution_id) throw redirect(303, '/link')

        const institution = await event.fetch(`/api/plaid/institutions/${profile?.plaid_institution_id}.json`)
            .then(r => r.ok ? r.json() : Promise.reject(r))
        
        return {
            profile,
            institution
        }
    }
}
