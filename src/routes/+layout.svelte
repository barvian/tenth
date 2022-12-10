<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import '~/app.css';
	import Arrow from '~/components/icons/Arrow.svelte';
	import Logo from '~/components/icons/Logo.svelte';
	import UserDropdown from '~/components/UserDropdown.svelte';
	import supabaseClient from '~/lib/db';

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
    <div class="md:flex-1 pb-1">
		<a href="/" class="{$page.url.pathname === '/' ? '!text-black' : 'text-gray-450'}">
			<Logo />
		</a>
    </div>
	<ul class="flex items-center justify-center md:flex-1 gap-x-[calc(theme(space.2)+5vw)]">
		<li><a href="/pricing" class="font-medium {$page.url.pathname === '/pricing' ? '!text-black' : 'text-gray-450'}">Pricing</a></li>
		<li><a href="/support" class="font-medium {$page.url.pathname === '/support' ? '!text-black' : 'text-gray-450'}">Support</a></li>
	</ul>

	<div class="md:flex-1 text-right">
		{#if $page.data.session}
			<UserDropdown />
		{:else}
			{@const active = $page.url.pathname === '/login'}
			<a class="font-medium whitespace-nowrap group {active ? '!text-black' : 'text-gray-450'}" href="/login">
				Sign in
				<Arrow strokeWidth={1} class="inline-block align-baseline ml-1.5 h-2.5 -scale-x-100 transition-transform group-hover:translate-x-0.5 {active ? 'translate-x-0.5' : ''}" />
			</a>
		{/if}
	</div>
    
</nav>

<main class="inner pt-xl pb-2xl flex-1 flex flex-col items-center justify-center">
	<slot />
</main>

<footer class="flex gap-3 inner justify-center text-gray-500">
	<span>© 2022 Tenth, LLC.</span>
	<span>·</span>
	<a href="/about" class="font-medium {$page.url.pathname === '/about' ? '!text-black' : 'text-gray-450'}">About</a>
	<span>·</span>
	<a href="/privacy" class="font-medium {$page.url.pathname === '/privacy' ? '!text-black' : 'text-gray-450'}">Privacy</a>
	<span>·</span>
	<a href="/terms" class="font-medium {$page.url.pathname === '/terms' ? '!text-black' : 'text-gray-450'}">Terms</a>
</footer>