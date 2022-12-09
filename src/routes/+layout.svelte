<script lang="ts">
	import '~/app.css';
	import supabaseClient from '~/lib/db';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
    import Arrow from '~/components/icons/Arrow.svelte';
    import Logo from '~/components/icons/Logo.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast'

	onMount(() => {
		const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth')
		})

		return () => {
			subscription.unsubscribe()
		}
	})

	const toastOptions = {
		intro: { y: 40 }
	}
</script>

<SvelteToast options={toastOptions} />

<nav class="inner flex items-center justify-between">
    <a href="/" class="block w-min {$page.url.pathname === '/' ? '!text-black' : 'text-gray-450'}">
        <Logo />
    </a>
	<ul class="flex items-center gap-x-8">
		<li><a href="/pricing" class="font-medium {$page.url.pathname === '/pricing' ? '!text-black' : 'text-gray-450'}">Pricing</a></li>
		<li><a href="/support" class="font-medium {$page.url.pathname === '/support' ? '!text-black' : 'text-gray-450'}">Support</a></li>
	</ul>

    {#if $page.data.session}
        <a class="whitespace-nowrap group" href="/dashboard">
            Dashboard
            <Arrow strokeWidth={1} class="inline-block align-baseline ml-1.5 h-2.5 -scale-x-100 transition-transform group-hover:translate-x-0.5" />
        </a>
    {:else}
		{@const active = $page.url.pathname === '/login'}
        <a class="font-medium whitespace-nowrap group {active ? '!text-black' : 'text-gray-450'}" href="/login">
            Sign in
            <Arrow strokeWidth={1} class="inline-block align-baseline ml-1.5 h-2.5 -scale-x-100 transition-transform group-hover:translate-x-0.5 {active ? 'translate-x-0.5' : ''}" />
        </a>
    {/if}
</nav>

<main class="inner pt-xl pb-2xl flex-1 flex flex-col items-center justify-center">
	<slot />
</main>

<footer class="flex gap-3 inner justify-center text-gray-500">
	<span>© 2022 Tenth, LLC.</span>
	<span>·</span>
	<a href="/privacy" class="font-medium {$page.url.pathname === '/privacy' ? '!text-black' : 'text-gray-450'}">Privacy</a>
	<span>·</span>
	<a href="/terms" class="font-medium {$page.url.pathname === '/terms' ? '!text-black' : 'text-gray-450'}">Terms</a>
</footer>