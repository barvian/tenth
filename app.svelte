<script context="module" lang="ts">
	import {
		getSupabase,
		getServerSession
	} from '@supabase/auth-helpers-sveltekit'
	import type { LayoutLoad, LayoutServerLoad } from './app/$types'

	export const getData = (async (event) => {
		const { session } = await getSupabase(event)
		return { session }
	}) satisfies LayoutLoad

	export const getServerData = (async (event) => {
		return {
			session: await getServerSession(event)
		}
	}) satisfies LayoutServerLoad
</script>

<script lang="ts">
	import { dev } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { onMount } from 'svelte'
	import './app.css'
	import FormProvider from '~/components/forms/FormProvider.svelte'
	import Logo from '~/components/icons/Logo.svelte'
	import supabaseClient from '~/lib/db'
	import CurrentUser from '~/components/CurrentUser.svelte'

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

	const toastOptions = {
		intro: { y: 40 }
	}

	$: if (dev && !$page.data.meta?.title && $page.status === 200) {
		throw new Error('No page title specified')
	}
</script>

<svelte:head>
	<title>Tenth: {$page.status === 200 ? $page.data.meta?.title : 'Error'}</title
	>
	<meta
		name="description"
		content={$page.status === 200
			? $page.data.meta?.description
			: $page.error?.message}
	/>
</svelte:head>

<SvelteToast options={toastOptions} />

<FormProvider>
	<nav class="flex items-center justify-between h-16 px-page">
		<a
			href={$page.data.session ? '/dashboard' : '/'}
			class="{['/', '/dashboard'].includes($page.url.pathname)
				? '!text-black'
				: 'text-gray-450'} pb-1"
		>
			<Logo />
		</a>

		<ul
			class="contents xs:flex items-center justify-center xs:absolute xs:left-1/2 xs:-translate-x-1/2 xs:gap-x-[calc(theme(space.2)+5vw)]"
		>
			<li>
				<a
					href="/pricing"
					class="font-medium {$page.url.pathname === '/pricing'
						? '!text-black'
						: 'text-gray-450'}">Pricing</a
				>
			</li>
			<li>
				<a
					href="/support"
					class="font-medium {$page.url.pathname === '/support'
						? '!text-black'
						: 'text-gray-450'}"
					>{#if $page.data.session}Support{:else}FAQs{/if}</a
				>
			</li>
		</ul>

		<CurrentUser class="ml-auto" />
	</nav>

	<main
		class="px-page pt-xl pb-2xl flex-1 flex flex-col items-center justify-center"
	>
		<slot />
	</main>

	<footer
		class="flex gap-3 flex-wrap px-page justify-center text-gray-500 py-8"
	>
		<span>© 2022 Tenth, LLC</span>
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
</FormProvider>
