<script lang="ts">
	import type { PageData } from './$types';
    import Dashboard from './Dashboard.svelte';
    import Register from './Register.svelte';

    export let data: PageData
</script>

{#if data.session}
    <Dashboard />
{:else}
    <Register />
{/if}