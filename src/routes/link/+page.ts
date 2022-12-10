import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { withLoadAuth } from '~/lib/auth';
import type { PageLoad } from './$types';

export const load = withLoadAuth<PageLoad>(async (event) => {    
    const { supabaseClient } = await getSupabase(event)
    const { data: profile } = await supabaseClient.from('profiles').select(
        'plaid_institution_id, plaid_account_mask'
    ).single()

    let institution: any
    if (profile?.plaid_institution_id) {
        institution = await event.fetch(`/api/plaid/institutions/${profile?.plaid_institution_id}.json`)
            .then(r => r.ok ? r.json() : Promise.reject(r))
    }
    
    return {
        ...event.data,
        profile,
        institution
    }
})