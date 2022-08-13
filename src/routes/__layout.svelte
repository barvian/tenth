<script lang="ts">
	import { goto } from '$app/navigation';
	import { session, page } from '$app/stores';
	import { supabaseClient } from '~/lib/db';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';
	import '~/app.css';
</script>

<SupaAuthHelper {supabaseClient} {session}>
	<slot />
</SupaAuthHelper>
