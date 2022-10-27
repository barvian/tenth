<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import theme from '~/../tailwind.colors.json';
	import Button from '~/components/Button/Button.svelte';
	import FlipCard from '~/components/FlipCard.svelte';
	import Input from '~/components/Input.svelte';
	import Nav from '~/components/Nav.svelte';
	import { values } from 'lodash';

	let loading = false
    const login: SubmitFunction = ({ action }) => {
        loading = true
        return async ({ result }) => {
            applyAction(result)
            loading = false
        }
    }

	$: flipped = $page.form?.values.email && !$page.form?.values.token
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

<main class="justify-center flex flex-col items-center">
	<form action="?/verify" method="POST" use:enhance={login}>
		<FlipCard {flipped}>
			<fieldset slot="front" class="h-full flex flex-col">
				<h1 class="text-2xl font-bold text-center mb-5">Sign in to Tenth</h1>
				<Input required showRequired={false} type="email" name="email" label="Email" value={$page.form?.values.email ?? ''}>
					We'll send you a code to get you signed in.
				</Input>
				<Button {loading} formaction="?/send" type="submit" fullWidth class="mt-4">
					Sign in
				</Button>
			</fieldset>
			<fieldset slot="back" class="h-full flex flex-col">
				<h2 class="text-2xl font-bold text-center mb-[min(auto,theme(space.3))]">Welcome back!</h2>
				<p class="text-lg text-dim mb-auto leading-snug text-center">Please enter the 6-digit code we sent to <span class="font-medium text-black">{$page.form?.values.email}</span>.</p>
				<Input required={flipped} showRequired={false} type="text" name="token" label="Code" value={$page.form?.values.token ?? ''}>
					Didn't get a code? Resend.
				</Input>
				<Button {loading} formaction="?/verify" type="submit" fullWidth>
					Continue
				</Button>
			</fieldset>
		</FlipCard>
	</form>
</main>
<footer class="flex gap-3 inner justify-center text-amber-400 pt-section pb-7">
	<span>© 2022 Tenth, LLC.</span>
	<span>·</span>
	<a href="/privacy">Privacy</a>
	<span>·</span>
	<a href="/terms">Terms</a>
</footer>
