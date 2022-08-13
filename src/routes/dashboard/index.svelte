<script lang="ts" context="module">
	import { supabaseServerClient, type User } from '@supabase/auth-helpers-sveltekit';
	import { withLoadAuth } from '~/lib/auth';
	import type { Load } from './__types/index';
	import type { definitions } from "types/supabase";

	export const load = withLoadAuth<Load>(async ({ session }) => {
		const { data } = await supabaseServerClient(session.accessToken).from('test').select('*');
		return {
			props: {
				data,
				user: session.user
			},
			cache: {
				maxage: 300,
			},
			dependencies: [`supabase:user-${session.user.id}`]
		};
	});
</script>

<script lang="ts">
	import { supabaseClient } from '~/lib/db';
	import { goto, invalidate } from '$app/navigation';

	export let data: definitions["test"][];
	export let user: User;

	async function insertData() {
		await supabaseClient.from<definitions["test"]>('test').insert({}, { returning: 'minimal' });
		await invalidate(`supabase:user-${user.id}`)
	}
</script>

<p>
	[<a href="/">Home</a>]
</p>
<div>Protected content for {user.email}</div>
<p>server-side fetched data with RLS:</p>
<button on:click={insertData}>Insert data</button>
<pre>{JSON.stringify(data, null, 2)}</pre>
<p>user:</p>
<pre>{JSON.stringify(user, null, 2)}</pre>
