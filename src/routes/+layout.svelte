<script lang="ts">
	import { dev } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { parseToRgba, readableColorIsBlack } from 'color2k'
	import { onMount } from 'svelte'
	import '~/app.css'
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

	$: bankColor = $page.data.institution?.primary_color
		? parseToRgba($page.data.institution.primary_color).slice(0, 3).join(' ')
		: null
	$: bankReadableColor =
		$page.data.institution?.primary_color &&
		(readableColorIsBlack($page.data.institution.primary_color)
			? '0 0 0'
			: '255 255 255')
	$: bankStyle =
		bankColor &&
		`<style>:root { --color-bank: ${bankColor}; --color-bank-readable: ${bankReadableColor}; }</style>`

	const toastOptions = {
		intro: { y: 40 }
	}

	$: if (dev && !$page.data.meta?.title && !$page.error) {
		throw new Error('No page title specified')
	}
</script>

<svelte:head>
	<title>Tenth: {$page.error ? 'Error' : $page.data.meta?.title}</title>
	{#if $page.data?.meta?.description}
		<meta name="description" content={$page.data.meta.description} />
	{/if}

	{@html bankStyle ?? ''}
</svelte:head>

<SvelteToast options={toastOptions} />

<FormProvider>
	<nav class="inner flex items-center justify-between mt-5 h-10">
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

		<CurrentUser class="ml-auto" />
	</nav>

	<main
		class="inner pt-xl pb-2xl flex-1 flex flex-col items-center justify-center"
	>
		<slot />
	</main>

	<footer class="flex gap-3 flex-wrap inner justify-center text-gray-500 mb-9">
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
