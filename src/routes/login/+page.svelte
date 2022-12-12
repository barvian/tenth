<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';
	import Button from '~/components/Button.svelte';
	import Input from '~/components/Input.svelte';
	import MultiStep from '~/components/MultiStep/MultiStep.svelte';
	import Step from '~/components/MultiStep/Step.svelte';
	import supabaseClient, { EmailDoesntExistError } from '~/lib/db';
	import type { ActionData } from './$types';

	export let form: ActionData

	let multiStep: MultiStep
	let email = form?.values.email ?? ''
	let loading = false
	let emailError: string | null | undefined, tokenError: string | null | undefined

    const login: SubmitFunction = async ({ cancel }) => {
        loading = true

		if (multiStep.getStep() === 0) {
			cancel()
			try {
                const { data: emailExists, error: checkEmailError } = await supabaseClient.rpc('email_exists', { email }).single()
                if (checkEmailError) throw checkEmailError
                else if (!emailExists) throw new EmailDoesntExistError()

                const { error: signInError } = await supabaseClient.auth.signInWithOtp({
                    email,
                    options: {
                        shouldCreateUser: false
                    }
                })
                if (signInError) throw signInError

                multiStep.next()
            } catch (e) {
                if (e instanceof EmailDoesntExistError) emailError = `We couldn't find a Tenth account with that email.`
                else toast.push('Something went wrong. Please try again later.', { classes: ['error'] })
			}
			loading = false
		}
		
		return async ({ result, update }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				multiStep.complete()
			} else if (result.type === 'invalid' && result.status === 401) {
				tokenError = result.data?.error
			} else {
				toast.push('Something went wrong. Please try again later.', { classes: ['error'] })
			}
			await update()
			loading = false
		}
    }
</script>

<form method="POST" use:enhance={login}>
	<MultiStep bind:this={multiStep} let:reset>
		<Step as="fieldset">
			<h1 class="text-4xl font-bold text-center mb-8">Sign in to Tenth</h1>
			<Input class="max-w-xs" required bind:error={emailError} showRequired={false} type="email" name="email" label="Email" on:input={reset} bind:value={email}>
				We'll send you a code to get you signed in.
			</Input>
			<Button type="submit" disabled={Boolean(emailError)} width="w-full max-w-xs" class="mt-7">
				Sign in
			</Button>
		</Step>
		<Step as="fieldset" let:active>
			<h2 class="text-3xl font-bold text-center mb-5">Welcome back!</h2>
			<p class="text-lg text-gray-500 mb-8 leading-snug text-center">Please enter the 6-digit code we sent to <mark>{email}</mark>.</p>
			<Input class="max-w-xs" required={active} showRequired={false} type="text" name="token" label="Code" value={form?.values.token ?? ''} bind:error={tokenError} />
			<Button width="w-full max-w-xs" class="mt-7" {loading} disabled={Boolean(tokenError)} type="submit">
				Continue
			</Button>
		</Step>
	</MultiStep>
</form>