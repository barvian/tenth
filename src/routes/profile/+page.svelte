<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from "$app/forms";
	import { toast } from '@zerodevx/svelte-toast';
	import Button from "~/components/Button.svelte";
	import Input from "~/components/Input.svelte";
    import { page } from '$app/stores'
	import type { ActionData, PageData } from "./$types";

    export let data: PageData
    export let form: ActionData
    $: updated = Boolean($page.status === 200 && form?.values)

    let email = data.session?.user.email
    
    let saving = false, emailError: string | undefined
    const save: SubmitFunction = ({}) => {
        saving = true
        return async ({ result }) => {
            if (result.type === 'invalid') {
                emailError = `Couldn't update email. Please try again later.`
            }
            await applyAction(result) // no need to invalidate anything
            saving = false
        }
    }

    let destroying = false
    const destroy: SubmitFunction = ({cancel}) => {
        if (!confirm('Are you sure you want to delete your account?')) return cancel()
        destroying = true
        return async ({ update, result }) => {
            if (result.type === 'invalid') {
                toast.push(`Couldn't delete account. Please try again later.`, { classes: ['error'] })
            }
            await update()
            destroying = false
        }
    }
</script>

<h1 class="text-4xl font-bold text-center mb-8 max-w-2xl">Your profile</h1>
<form method="POST" action="?/update" class="max-w-sm w-full" use:enhance={save}>
    <Input class="mb-3" label="First name" name="first" value={data.profile.first_name} disabled />
    <Input label="Last name" name="last" value={data.profile.last_name} disabled>
        You're not able to change your name right now.
    </Input>
    <Input class="mt-6" type="email" label="Email" name="email" bind:value={email} bind:error={emailError} disabled={updated} showDescription={!updated && email !== data.session?.user.email}>
        We'll send you a confirmation to complete your email change.
    </Input>
    <Button class="mt-8" type="submit" disabled={Boolean(emailError) || updated || email === data.session?.user.email} loading={saving}>
        Save profile
    </Button>
</form>
<form method="POST" action="?/delete" class="max-w-sm w-full" use:enhance={destroy}>
    <Button inconspicuous color="text-red-400" class="mt-8" type="submit" loading={destroying}>
        Delete account
    </Button>
</form>
