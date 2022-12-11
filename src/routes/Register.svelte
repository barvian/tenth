<script lang="ts">
    import { enhance, type SubmitFunction } from '$app/forms';
    import { toast } from '@zerodevx/svelte-toast';
    import { fade } from 'svelte/transition';
    import type { Nonprofit } from 'types/change';
    import Button from '~/components/Button.svelte';
    import Charities from '~/components/Charity/Charities.svelte';
    import Input from '~/components/Input.svelte';
    import MultiStep from "~/components/MultiStep/MultiStep.svelte";
    import Step from "~/components/MultiStep/Step.svelte";
    import Select from "~/components/Select.svelte";
    import supabaseClient, { EmailExistsError } from '~/lib/db';

    let designated: Nonprofit[] = []
    
    let multiStep: MultiStep
    $: if (multiStep && designated.length === 0) multiStep.reset()
    
    let email = ''

    let loading = false, emailError: string | null | undefined, tokenError: string | null | undefined
    const register: SubmitFunction = async ({ cancel }) => {
        loading = true

        if (multiStep.getStep() === 0) {
            cancel()
            multiStep.next()
            loading = false
		} else if (multiStep.getStep() === 1) {
            cancel()
            try {
                const { data: emailExists, error: checkEmailError } = await supabaseClient.rpc('email_exists', { email }).single()
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
                if (e instanceof EmailExistsError) emailError = `That email is already in use. Try another.`
                else toast.push('Something went wrong. Please try again later.', { classes: ['error'] })
            }
            loading = false
        }
        
        return async ({ update, result }) => {
            if (result.type === 'success' || result.type === 'redirect') {
                multiStep.complete()
            } else {
                toast.push(`Couldn't register. Please try again later.`, { classes: ['error'] })
            }
            await update()
            loading = false
        }
    }
</script>

<form action="?/register" method="POST" use:enhance={register}>
    <MultiStep bind:this={multiStep} let:next let:prev let:reset leaveAlert="Are you sure you want to exit? You'll have to start the sign-up process again.">
        <Step as="fieldset">
            <h1 class="text-4xl max-w-2xl text-center leading-tight font-bold">
                Donate
                <Select name="percentage">
                    <option value="33">33%</option>
                    <option value="25">25%</option>
                    <option value="20">20%</option>
                    <option value="15">15%</option>
                    <option value="10">10%</option>
                    <option value="5">5%</option>
                    <option value="3">3%</option>
                    <option value="2">2%</option>
                    <option value="1">1%</option>
                </Select>%
                of your checking account to charity every year.
            </h1>
            <p class="text-xl max-w-2xl text-center text-gray-500 mt-5 mb-8">Donated in monthly increments. Cancelable anytime.</p>
            <Charities bind:designated />
            {#if designated.length > 0}
                <div in:fade|local class="mt-8 max-w-md w-full">
                    <Button type="submit">Get started</Button>
                </div>
            {/if}
        </Step>
        <Step as="fieldset" let:active>
            <h2 class="text-3xl max-w-2xl font-bold mb-8 text-center">Create an account</h2>
            <div class="grid grid-cols-2 gap-6 max-w-md w-full">
                <Input required={active} type="text" name="first-name" label="First name" />
                <Input required={active} type="text" name="last-name" label="Last name" />
                <Input bind:error={emailError} bind:value={email} on:input={reset} class="col-span-full" required={active} type="email" name="email" label="Email">
                    We'll send you a code to verify your email address.
                </Input>
            </div>
            <Button {loading} type="submit" class="mt-8 max-w-md">
                Continue
            </Button>
        </Step>
        <Step as="fieldset" let:active>
            <h2 class="text-3xl max-w-xl text-center font-bold mb-5">Verify your email</h2>
            <p class="text-lg max-w-xl leading-snug mb-8 text-gray-500 text-center">Please enter the 6-digit code we sent to <mark>{email}</mark>.</p>
            <Input class="max-w-xs" maxlength={6} required={active} type="text" name="token" label="Code" />
            <Button {loading} type="submit" class="mt-8 max-w-xs">
                Continue
            </Button>
        </Step>
    </MultiStep>
</form>