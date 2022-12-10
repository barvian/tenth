import type { PageLoad } from './$types';
import { withLoadAuth } from '~/lib/auth'
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load = withLoadAuth<PageLoad>(async event => {
    const { supabaseClient } = await getSupabase(event)
    const { data: profile, error } = await supabaseClient.from('profiles').select('first_name, last_name').single()
    if (error) throw error
    
    return {
        profile
    }
})
