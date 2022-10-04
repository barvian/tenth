import '$lib/db'; // make sure the supabase instance is initialized on the server
import { auth } from '@supabase/auth-helpers-sveltekit/server';

export const handle = auth();