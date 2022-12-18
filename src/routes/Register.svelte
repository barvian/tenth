<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import { toast } from '@zerodevx/svelte-toast'
	import { fade } from 'svelte/transition'
	import type { Nonprofit } from 'types/change'
	import Button from '~/components/Button.svelte'
	import CharitySearch from '~/components/Charity/CharitySearch.svelte'
	import Charity from '~/components/Charity/Charity.svelte'
	import X from '~/components/icons/X.svelte'
	import Input from '~/components/forms/Input.svelte'
	import MultiStep from '~/components/MultiStep/MultiStep.svelte'
	import Step from '~/components/MultiStep/Step.svelte'
	import Percentage from '~/components/forms/Percentage.svelte'
	import supabaseClient, { EmailExistsError } from '~/lib/db'

	let multiStep: MultiStep
	$: if (multiStep && designated.length === 0) multiStep.reset()

	let designated: Nonprofit[] = []
	function addCharity(event: CustomEvent) {
		const charity = event.detail as Nonprofit
		removeCharity(charity)
		designated = [...designated, charity]
	}
	function removeCharity(charity: Nonprofit) {
		designated = designated.filter((d) => d.id !== charity.id)
	}

	let email = ''

	let loading = false,
		emailError: string | null | undefined,
		tokenError: string | null | undefined
	const register: SubmitFunction = async ({ cancel }) => {
		loading = true

		if (multiStep.getStep() === 0) {
			cancel()
			multiStep.next()
			loading = false
		} else if (multiStep.getStep() === 1) {
			cancel()
			try {
				const { data: emailExists, error: checkEmailError } =
					await supabaseClient.rpc('email_exists', { email }).single()
				if (checkEmailError) throw checkEmailError
				else if (emailExists) throw new EmailExistsError()

				const { error: signInError } = await supabaseClient.auth.signInWithOtp({
					email,
					options: {
						shouldCreateUser: true
					}
				})
				if (signInError) throw signInError

				multiStep.next()
			} catch (e) {
				if (e instanceof EmailExistsError)
					emailError = `That email is already in use. Try another.`
				else
					toast.push('Something went wrong. Please try again later.', {
						classes: ['error']
					})
			}
			loading = false
		}

		return async ({ update, result }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				multiStep.complete()
			} else {
				toast.push(`Couldn't register. Please try again later.`, {
					classes: ['error']
				})
			}
			await update()
			loading = false
		}
	}
</script>

<form action="?/register" method="POST" use:enhance={register}>
	<MultiStep
		bind:this={multiStep}
		let:next
		let:prev
		let:reset
		leaveAlert="Are you sure you want to exit? You'll have to start the sign-up process again."
	>
		<Step as="fieldset">
			<div
				role="heading"
				aria-level={1}
				class="text-4xl max-w-2xl text-center font-bold"
			>
				Donate <Percentage /> of your checking account to charity every year.
			</div>
			<p class="text-xl max-w-2xl text-center text-gray-500 mt-5 mb-8">
				Donated in monthly increments. Cancelable anytime.
			</p>
			{#if designated.length > 0}
				<div class="space-y-4 w-full max-w-md mb-5">
					{#each designated as item (item.id)}
						<Charity charity={item}>
							<Button
								slot="tools"
								unstyled
								on:click={(e) => removeCharity(item)}
								class="py-2 pl-2 transition-colors text-gray-300 hover:text-red-500"
							>
								<X class="h-3.5" />
							</Button>
						</Charity>
					{/each}
				</div>
			{/if}
			<CharitySearch
				class="max-w-md w-full"
				label={designated.length > 0
					? 'Support another charity'
					: 'Which charity do you want to support?'}
				on:charity={addCharity}
			/>
			<input
				type="hidden"
				name="designated"
				value={JSON.stringify(designated.map((c) => c.id))}
			/>
			{#if designated.length > 0}
				<div in:fade|local class="mt-8 max-w-md w-full">
					<Button type="submit">Get started</Button>
				</div>
			{/if}
		</Step>
		<Step as="fieldset" let:active>
			<h2 class="text-3xl max-w-2xl font-bold mb-8 text-center">
				Create an account
			</h2>
			<div class="grid grid-cols-2 gap-6 max-w-md w-full">
				<Input
					required={active}
					type="text"
					name="first-name"
					label="First name"
				/>
				<Input
					required={active}
					type="text"
					name="last-name"
					label="Last name"
				/>
				<Input
					bind:error={emailError}
					bind:value={email}
					on:input={reset}
					class="col-span-full"
					required={active}
					type="email"
					name="email"
					label="Email"
					description="We'll send you a code to verify your email address."
				/>
			</div>
			<Button {loading} disabled={Boolean(emailError)} type="submit" class="mt-8 max-w-md">Continue</Button>
		</Step>
		<Step as="fieldset" let:active>
			<h2 class="text-3xl max-w-xl text-center font-bold mb-5">
				Verify your email
			</h2>
			<p class="text-lg max-w-xl leading-snug mb-8 text-gray-500 text-center">
				Please enter the 6-digit code we sent to <mark>{email}</mark>.
			</p>
			<Input
				class="max-w-xs"
				maxlength={6}
				required={active}
				type="text"
				name="token"
				label="Code"
			/>
			<Button {loading} type="submit" class="mt-8 max-w-xs">Continue</Button>
		</Step>
	</MultiStep>
</form>
