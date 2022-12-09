<script lang="ts">
	import type { PageData } from './$types';
    import Link from './Link.svelte';
    import Dashboard from './Dashboard.svelte';
    import Register from './Register.svelte';

    export let data: PageData
</script>

{#if data.profile}
    <Link />
{:else if data.session}
    <Dashboard />
{:else}
    <Register />
{/if}