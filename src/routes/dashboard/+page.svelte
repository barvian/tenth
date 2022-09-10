<script lang="ts">
	import { supabaseClient } from '~/lib/db';
	import { invalidate } from '$app/navigation';
	import type { PageData } from './$types'
	import type { definitions } from "types/supabase";

	export let data: PageData

	async function insertData() {
		await supabaseClient.from<definitions["test"]>('test').insert({}, { returning: 'minimal' });
		await invalidate(`supabase:user-${data.user.id}`)
	}
</script>

<p>
	[<a href="/">Home</a>]
</p>
<div>Protected content for {data.user.email}</div>
<p>server-side fetched data with RLS:</p>
<button on:click={insertData}>Insert data</button>
<pre>{JSON.stringify(data.rows, null, 2)}</pre>
<p>user:</p>
<pre>{JSON.stringify(data.user, null, 2)}</pre>
