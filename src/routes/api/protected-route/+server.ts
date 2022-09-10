import { supabaseServerClient, withApiAuth } from '@supabase/auth-helpers-sveltekit';
import type { RequestHandler } from '../$types';

interface TestTable {
	id: string;
	created_at: string;
}

interface GetOutput {
	data: TestTable[];
}

throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
export const GET: RequestHandler<GetOutput> = async ({ locals, request }) =>
	withApiAuth({ user: locals.user }, async () => {
		const { data } = await supabaseServerClient(request).from<TestTable>('test').select('*');

		return {
			status: 200,
			body: { data }
		};
	});
