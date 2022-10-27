<script lang="ts">
    import { page } from '$app/stores';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
    import Logo from './icons/Logo.svelte';

    let cls = ''
    export {cls as class}
    
	const logout: SubmitFunction = () => {
        return async ({ result }) => {
            await invalidateAll();
            applyAction(result);
        }
    }
</script>

<div class="inner flex items-center justify-between {cls}">
    <a href="/" data-sveltekit-reload={$page.url.pathname === '/' ? 'off' : ''} class="block w-min">
        <Logo />
    </a>

    {#if $page.data.session}
        <form action="/logout" method="POST" use:enhance={logout}>
            <button type="submit">Sign out</button>
        </form>
    {:else}
        <a class="text-dim text-sm" href="/login">Sign in</a>
    {/if}
</div>