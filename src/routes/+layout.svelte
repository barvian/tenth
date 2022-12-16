<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { parseToRgba } from 'color2k'
	import { onMount } from 'svelte'
	import '~/app.css'
	import Arrow from '~/components/icons/Arrow.svelte'
	import Logo from '~/components/icons/Logo.svelte'
	import UserDropdown from '~/components/UserDropdown.svelte'
	import supabaseClient from '~/lib/db'

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidateAll()
		})

		return () => {
			subscription.unsubscribe()
		}
	})

	$: bankColor = $page.data.institution?.primary_color
		? parseToRgba($page.data.institution.primary_color).slice(0, 3).join(' ')
		: null
	$: bankStyle =
		bankColor && `<style>:root { --color-bank: ${bankColor}; }</style>`

	const toastOptions = {
		intro: { y: 40 }
	}
</script>

<svelte:head>
	<title>Tenth: {$page.data.meta.title}</title>
	{#if $page.data.meta.description}
		<meta name="description" content={$page.data.meta.description} />
	{/if}

	{#if bankStyle}{@html bankStyle}{/if}
</svelte:head>

<SvelteToast options={toastOptions} />

<nav class="inner flex items-center justify-between mt-5 h-10">
	<a
		href="/"
		class="{$page.url.pathname === '/' ? '!text-black' : 'text-gray-450'} pb-1"
	>
		<Logo />
	</a>

	<ul
		class="contents xs:flex items-center justify-center xs:absolute xs:left-1/2 xs:-translate-x-1/2 xs:gap-x-[calc(theme(space.2)+5vw)]"
	>
		<li class="ml-auto">
			<a
				href="/pricing"
				class="font-medium {$page.url.pathname === '/pricing'
					? '!text-black'
					: 'text-gray-450'}">Pricing</a
			>
		</li>
		<li class="ml-auto">
			<a
				href="/support"
				class="font-medium {$page.url.pathname === '/support'
					? '!text-black'
					: 'text-gray-450'}"
				>{#if $page.data.session}Support{:else}FAQs{/if}</a
			>
		</li>
	</ul>

	{#if $page.data.session}
		<UserDropdown class="ml-auto" />
	{:else}
		{@const active = $page.url.pathname === '/login'}
		<a
			class="font-medium whitespace-nowrap group ml-auto {active
				? '!text-black'
				: 'text-gray-450'}"
			href="/login"
		>
			Sign in
			<Arrow
				strokeWidth={1}
				class="inline-block align-baseline ml-1.5 h-2.5 -scale-x-100 transition-transform group-hover:translate-x-0.5 {active
					? 'translate-x-0.5'
					: ''}"
			/>
		</a>
	{/if}
</nav>

<main
	class="inner pt-xl pb-2xl flex-1 flex flex-col items-center justify-center"
>
	<slot />
</main>

<footer class="flex gap-3 flex-wrap inner justify-center text-gray-500 mb-9">
	<span>© 2022 Tenth, LLC.</span>
	<!-- <span>·</span>
	<a href="/about" class="font-medium {$page.url.pathname === '/about' ? '!text-black' : 'text-gray-450'}">About</a> -->
	<span>·</span>
	<a
		href="/privacy"
		class="font-medium {$page.url.pathname === '/privacy'
			? '!text-black'
			: 'text-gray-450'}">Privacy</a
	>
	<span>·</span>
	<a
		href="/terms"
		class="font-medium {$page.url.pathname === '/terms'
			? '!text-black'
			: 'text-gray-450'}">Terms</a
	>
</footer>
