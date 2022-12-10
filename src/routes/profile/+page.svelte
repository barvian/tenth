<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from "$app/forms";
	import Button from "~/components/Button.svelte";
	import Input from "~/components/Input.svelte";
	import { afterUpdate } from "~/lib/component";
	import type { ActionData, PageData } from "./$types";

    export let data: PageData
    export let form: ActionData

    let email = data.session?.user.email
    let error: string | undefined
    afterUpdate(() => error = form?.error, () => [form?.error])
    
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
<form method="POST" class="max-w-sm w-full" use:enhance={save}>
    <Input class="mb-3" label="First name" name="first" value={data.profile.first_name} disabled />
    <Input label="Last name" name="last" value={data.profile.last_name} disabled>
        You're not able to change your name right now.
    </Input>
    <Input class="mt-6" label="Email" name="email" bind:value={email} bind:error={error} disabled={form?.success} showDescription={!form?.success && email !== data.session?.user.email}>
        We'll send you a confirmation to complete your email change.
    </Input>
    <Button class="mt-8" type="submit" disabled={error || form?.success || email === data.session?.user.email} loading={saving}>
        Save profile
    </Button>
</form>
