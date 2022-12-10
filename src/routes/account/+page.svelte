<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from "$app/forms";
	import Button from "~/components/Button.svelte";
	import Input from "~/components/Input.svelte";
    import { toast } from '@zerodevx/svelte-toast';
	import { afterUpdate } from "~/lib/component";
	import type { ActionData, PageData } from "./$types";

    export let data: PageData
    export let form: ActionData

    let email = data.session?.user.email
    let emailError: string | undefined
    afterUpdate(() => {
        if (form?.error && form?.values?.email) emailError = form?.error
    }, () => [form])
    
    let saving = false
    const save: SubmitFunction = ({}) => {
        saving = true
        return async ({ result }) => {
            await applyAction(result) // no need to invalidate anything
            saving = false
        }
    }

    $: if (form?.error && !form?.values?.email) toast.push(`Something went wrong. Please try again later.`, { classes: ['error'] })

    let destroying = false
    const destroy: SubmitFunction = ({cancel}) => {
        if (!confirm('Are you sure you want to delete your account?')) return cancel()
        destroying = true
        return async ({ update }) => {
            await update()
            destroying = false
        }
    }
</script>

<h1 class="text-4xl font-bold text-center mb-8 max-w-2xl">Your account</h1>
<form method="POST" action="?/update" class="max-w-sm w-full" use:enhance={save}>
    <Input class="mb-3" label="First name" name="first" value={data.profile.first_name} disabled />
    <Input label="Last name" name="last" value={data.profile.last_name} disabled>
        You're not able to change your name right now.
    </Input>
    <Input class="mt-6" label="Email" name="email" bind:value={email} bind:error={emailError} disabled={form?.success} showDescription={!form?.success && email !== data.session?.user.email}>
        We'll send you a confirmation to complete your email change.
    </Input>
    <Button class="mt-8" type="submit" disabled={emailError || form?.success || email === data.session?.user.email} loading={saving}>
        Save profile
    </Button>
</form>
<form method="POST" action="?/delete" class="max-w-sm w-full" use:enhance={destroy}>
    <Button inconspicuous color="text-red-400" class="mt-8" type="submit" loading={destroying}>
        Delete account
    </Button>
</form>
