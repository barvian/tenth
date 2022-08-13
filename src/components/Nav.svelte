<script>
    import { session, page } from '$app/stores';
    import Logo from './icons/Logo.svelte';

    let cls = ''
    export {cls as class}
</script>

<div class="inner flex items-center justify-between {cls}">
    <a href="/" class="block w-min">
        <Logo />
    </a>

    {#if $session?.user?.id}
        <a href="/api/auth/logout">Sign out</a>
    {:else}
        <a class="text-dim text-sm" href="/login">Sign in</a>
    {/if}
</div>