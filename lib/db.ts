import env from '$env'
import { createClient } from '@supabase/auth-helpers-sveltekit'
import type { Organization } from '~/types/pledge'

export type Designation = { organization: Organization; weight: number }

export default createClient(
	env.PUBLIC_SUPABASE_URL,
	env.PUBLIC_SUPABASE_ANON_KEY,
	{
		realtime: {
			params: {
				eventsPerSecond: 1
			}
		}
	}
)
