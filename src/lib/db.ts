import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL
} from '$env/static/public'
import { createClient } from '@supabase/auth-helpers-sveltekit'

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
