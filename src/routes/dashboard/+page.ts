import { supabaseServerClient, type User } from '@supabase/auth-helpers-sveltekit';
import { withLoadAuth } from '~/lib/auth';
import type { PageLoad } from './$types';
import type { definitions } from "types/supabase";

export const load = withLoadAuth<PageLoad>(async ({ parent, depends, setHeaders }) => {
	const { session } = await parent()
	depends(`supabase:user-${session.user.id}`)
	setHeaders({
		'cache-control': 'max-age=300'
	});

	const { data: rows } = await supabaseServerClient(session.accessToken).from('test').select('*');

	return {
		rows,
		user: session.user
	}
});
