<script lang="ts">
	import type { ActionData, PageData } from "./$types";
    import Input from "~/components/Input.svelte";
    import Button from "~/components/Button.svelte";
	import { applyAction, enhance, type SubmitFunction } from "$app/forms";
    import { page } from '$app/stores'
	import { fade } from "svelte/transition";

    export let data: PageData
    export let form: ActionData

    let email = data.session?.user.email
    let error: string | undefined
    $: form?.error && updateError()
    const updateError = () => error = form?.error // ignore form error changes
    
    let saving = false
    const save: SubmitFunction = ({}) => {
        saving = true
        return async ({ result }) => {
            await applyAction(result)
            saving = false
        }
    }
</script>

<h1 class="text-4xl font-bold text-center mb-8 max-w-2xl">Your profile</h1>
<form method="POST" class="max-w-sm w-full space-y-6" use:enhance={save}>
    <Input label="First name" name="first" value={data.profile.first_name} disabled />
    <Input label="Last name" name="last" value={data.profile.last_name} disabled />
    <Input label="Email" name="email" bind:value={email} bind:error={error} disabled={form?.success} showDescription={!form?.success && email !== data.session?.user.email}>
        We'll send you a confirmation if you change your email.
    </Input>
    <Button class="!mt-8" type="submit" disabled={error || form?.success || email === data.session?.user.email} loading={saving}>
        Save profile
    </Button>
</form>
