<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import '~/app.css';
	import Button from '~/components/Button.svelte';
	import Arrow from '~/components/icons/Arrow.svelte';
	import Heart from '~/components/icons/Heart.svelte';
	import Logo from '~/components/icons/Logo.svelte';
	import Tip from '~/components/icons/Tip.svelte';
	import UserDropdown from '~/components/UserDropdown.svelte';
	import supabaseClient from '~/lib/db';
	import { parseToRgba } from 'color2k'
	
	onMount(() => {
		const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth')
		})

		return () => {
			subscription.unsubscribe()
		}
	})

	$: bankColor = $page.data.institution?.primary_color ? 
		parseToRgba($page.data.institution.primary_color).slice(0,3).join(' ') :
		null

	const toastOptions = {
		intro: { y: 40 }
	}
</script>

<svelte:head>
	{#if bankColor}
		{@html `<style>:root { --color-bank: ${bankColor}; }</style>`}
	{/if}
</svelte:head>

<SvelteToast options={toastOptions} />

<nav class="inner flex items-center justify-between">
	<a href="/" class="{$page.url.pathname === '/' ? '!text-black' : 'text-gray-450'} pb-1">
		<Logo />
	</a>

	<ul class="contents xs:flex items-center justify-center xs:absolute xs:left-1/2 xs:-translate-x-1/2 xs:gap-x-[calc(theme(space.2)+5vw)]">
		<li class="ml-auto"><a href="/pricing" class="font-medium {$page.url.pathname === '/pricing' ? '!text-black' : 'text-gray-450'}">Pricing</a></li>
		<li class="ml-auto"><a href="/support" class="font-medium {$page.url.pathname === '/support' ? '!text-black' : 'text-gray-450'}">Support</a></li>
	</ul>

	{#if $page.data.session}
	<UserDropdown class="ml-auto" />
	{:else}
	{@const active = $page.url.pathname === '/login'}
	<a class="font-medium whitespace-nowrap group {active ? '!text-black' : 'text-gray-450'}" href="/login">
		Sign in
		<Arrow strokeWidth={1} class="inline-block align-baseline ml-1.5 h-2.5 -scale-x-100 transition-transform group-hover:translate-x-0.5 {active ? 'translate-x-0.5' : ''}" />
	</a>
	{/if}
	{#if $page.data.profile?.stripe_linked}
		<Button href="/tip" class="ml-3 xs:ml-6 group" width="w-min" textSize="text-base" bg="xs:bg-rose-100/70 xs:active:bg-rose-200 {$page.url.pathname === '/tip' ? 'xs:!bg-rose-500' : '' }" color="text-rose-400 xs:text-rose-500 {$page.url.pathname === '/tip' ? 'text-rose-500 xs:text-white' : '' }" shadow={false} rounded="rounded-full" padding="xs:px-3 xs:pb-1 xs:pt-1.5">
			<Heart class="h-5 xs:hidden inline-block align-middle group-hover:animate-shake" />
			<Tip class="hidden h-4 xs:inline-block align-middle -mt-[3px] group-hover:animate-shake" />
			<span class="hidden xs:inline">Tip</span>
		</Button>
	{/if}
    
</nav>

<main class="inner pt-xl pb-2xl flex-1 flex flex-col items-center justify-center">
	<slot />
</main>

<footer class="flex gap-3 flex-wrap inner justify-center text-gray-500">
	<span>© 2022 Tenth, LLC.</span>
	<span>·</span>
	<a href="/about" class="font-medium {$page.url.pathname === '/about' ? '!text-black' : 'text-gray-450'}">About</a>
	<span>·</span>
	<a href="/privacy" class="font-medium {$page.url.pathname === '/privacy' ? '!text-black' : 'text-gray-450'}">Privacy</a>
	<span>·</span>
	<a href="/terms" class="font-medium {$page.url.pathname === '/terms' ? '!text-black' : 'text-gray-450'}">Terms</a>
</footer>