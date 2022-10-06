<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseClient } from '~/lib/db';
	import theme from '~/../tailwind.colors.json'
	import Nav from '~/components/Nav.svelte';
	import Input from '~/components/Input.svelte'
	import Button from '~/components/Button/Button.svelte';
	import { waitForSessionUser } from '~/lib/auth';
	import FlipCard from '~/components/FlipCard.svelte';
	import type { ApiError } from '@supabase/supabase-js';

	let email: string
	let otp: string
	let emailError: ApiError, otpError: ApiError
	let enteringOTP = true

	async function login() {
		({ error: emailError } = await supabaseClient.auth.signIn({ email }, { shouldCreateUser: false }))
		enteringOTP = true
	}

	async function verify() {
		({ error: otpError } = await supabaseClient.auth.verifyOTP({ email, token: otp, type: 'magiclink' }))
		if (!otpError) {
			await waitForSessionUser()
			await goto($page.url.searchParams.get('next') ?? '/dashboard')
		}
		enteringOTP = false
	}
</script>

<svelte:head>
	<meta name="theme-color" content={theme["amber"][50]}>
	<style>
		:root { @apply bg-gradient-to-b from-amber-50 to-amber-100 bg-no-repeat }
		body { @apply grid grid-rows-[min-content_1fr]; }
	</style>
</svelte:head>

<header class="pt-9 pb-section">
	<Nav />
</header>

<main class="self-center justify-self-center flex flex-col items-center gap-8 pb-section">
	<FlipCard bind:flipped={enteringOTP} complete={false}>
		<form slot="front" action="javascript:void(0);" on:submit={login} class="h-full flex flex-col">
			<h1 class="text-2xl font-bold text-center mb-5">Sign in to Tenth</h1>
			<Input required showRequired={false} type="email" name="email" label="Email" bind:value={email}>
				We'll send you a code to get you signed in.
			</Input>
			<Button type="submit" fullWidth class="mt-4">
				Sign in
			</Button>
		</form>
		<form slot="back" action="javascript:void(0);" on:submit={verify} class="h-full flex flex-col">
			<h2 class="text-2xl font-bold text-center mb-[min(auto,theme(space.3))]">Welcome back!</h2>
			<p class="text-lg text-dim mb-auto leading-snug text-center">Please enter the 6-digit code we sent to <span class="font-medium text-black">{email}</span>.</p>
			<Input required showRequired={false} type="text" name="otp" label="Code" bind:value={otp}>
				Didn't get a code? Resend.
			</Input>
			<Button type="submit" fullWidth>
				Continue
			</Button>
		</form>
	</FlipCard>
	<footer class="flex gap-3 inner text-amber-400">
		<span>© 2022 Tenth, LLC.</span>
		<span>·</span>
		<a href="/privacy">Privacy</a>
		<span>·</span>
		<a href="/terms">Terms</a>
	</footer>
</main>
