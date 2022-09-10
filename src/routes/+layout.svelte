<script lang="ts">
	import { writable } from 'svelte/store'
	import { page } from '$app/stores'
	import { supabaseClient } from '~/lib/db';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';
	import '~/app.css';

	const session = writable()
	$: $session = $page.data.session
</script>

<SupaAuthHelper {supabaseClient} {session}>
	<slot />
</SupaAuthHelper>
