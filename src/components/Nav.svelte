<script lang="ts">
    import { page } from '$app/stores';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
    import Logo from './icons/Logo.svelte';
	import Arrow from './icons/Arrow.svelte';

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
    <a href="/" class="block w-min">
        <Logo />
    </a>

    {#if $page.data.session}
        <a class="text-dim text-sm whitespace-nowrap group" href="/dashboard">
            Dashboard
            <Arrow strokeWidth={1} class="inline-block align-baseline ml-1.5 h-2.5 -scale-x-100 transition-transform group-hover:translate-x-0.5" />
        </a>
    {:else}
        <a class="text-dim text-sm whitespace-nowrap group" href="/login">
            Sign in
            <Arrow strokeWidth={1} class="inline-block align-baseline ml-1.5 h-2.5 -scale-x-100 transition-transform group-hover:translate-x-0.5" />
        </a>
    {/if}
</div>