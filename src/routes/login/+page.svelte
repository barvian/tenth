<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '~/components/Button.svelte';
	import Input from '~/components/Input.svelte';
	import MultiStep from '~/components/MultiStep/MultiStep.svelte';
	import Step from '~/components/MultiStep/Step.svelte';
	import supabaseClient, { EmailDoesntExistError } from '~/lib/db';
	import { toast } from '@zerodevx/svelte-toast'


	let multiStep: MultiStep, email = $page.form?.values.email ?? '', loading = false, emailError: string | null | undefined
    async function login(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
        loading = true

		if (multiStep.getStep() === 0) {
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
		} else {
			const response = await fetch(event.currentTarget.action, {
				method: event.currentTarget.method,
				body: new FormData(event.currentTarget)
			})
			const result = deserialize(await response.text())
			if (['redirect', 'success'].includes(result.type)) {
				multiStep.complete()
				await invalidateAll()
			}
			await applyAction(result)
		}

		loading = false
    }
</script>

<form method="POST" on:submit|preventDefault={login}>
	<MultiStep bind:this={multiStep} let:reset>
		<Step>
			<h1 class="text-4xl font-bold text-center mb-8">Sign in to Tenth</h1>
			<Input class="max-w-xs" required bind:error={emailError} showRequired={false} type="email" name="email" label="Email" on:input={reset} bind:value={email}>
				We'll send you a code to get you signed in.
			</Input>
			<Button type="submit" class="max-w-xs mt-7">
				Sign in
			</Button>
		</Step>
		<Step let:active>
			<h2 class="text-3xl font-bold text-center mb-5">Welcome back!</h2>
			<p class="text-lg text-gray-500 mb-8 leading-snug text-center">Please enter the 6-digit code we sent to <span class="text-black">{email}</span>.</p>
			<Input class="max-w-xs" required={active} showRequired={false} type="text" name="token" label="Code" value={$page.form?.values.token ?? ''} />
			<Button class="max-w-xs mt-7" {loading} type="submit">
				Continue
			</Button>
		</Step>
	</MultiStep>
</form>