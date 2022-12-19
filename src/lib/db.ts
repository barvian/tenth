import { createClient } from '@supabase/auth-helpers-sveltekit'
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public'

export default createClient(
	PUBLIC_SUPABASE_URL as string,
	PUBLIC_SUPABASE_ANON_KEY as string,
	{
		realtime: {
			params: {
				eventsPerSecond: 1
			}
		}
	}
)
