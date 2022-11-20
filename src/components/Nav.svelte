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
    <a href="/" class="block w-min">
        <Logo />
    </a>

    {#if $page.data.session}
        <a class="text-dim text-sm whitespace-nowrap group" href="/dashboard">
            Dashboard
            <svg class="inline-block align-baseline ml-1.5 h-2.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z" fill="currentColor" class="opacity-50" />
            </svg> 
        </a>
    {:else}
        <a class="text-dim text-sm whitespace-nowrap group" href="/login">
            Sign in
            <svg class="inline-block align-baseline ml-1.5 h-2.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.3536 4.35355C14.5488 4.15829 14.5488 3.84171 14.3536 3.64645L11.1716 0.464466C10.9763 0.269204 10.6597 0.269204 10.4645 0.464466C10.2692 0.659728 10.2692 0.976311 10.4645 1.17157L13.2929 4L10.4645 6.82843C10.2692 7.02369 10.2692 7.34027 10.4645 7.53553C10.6597 7.7308 10.9763 7.7308 11.1716 7.53553L14.3536 4.35355ZM0 4.5H14V3.5H0V4.5Z" fill="currentColor" class="opacity-50" />
            </svg> 
        </a>
    {/if}
</div>