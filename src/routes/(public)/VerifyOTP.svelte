<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores'
    import Button from '~/components/Button/Button.svelte';
    import Grid from '~/components/Grid.svelte';
	import Input from '~/components/Input.svelte';

    export let loading = false
    export let active = false
    
    const dispatch = createEventDispatcher();
</script>

<Grid>
    <fieldset class="lg:col-span-7">
        <h1 class="text-3xl font-bold mb-5">Verify your email</h1>
        <p class="text-lg leading-snug mb-5">Please enter the 6-digit code we sent to {$page.form?.values.email}. <button on:click={e => dispatch('changeemail', e)}>Change email</button>.</p>
        <Input value={$page.form?.values.token ?? ''} maxlength={6} width="w-1/2" required={active} shadow type="text" name="token" label="Code">
            Didn't receive a code? Resend.
        </Input>
        <Button {loading} type="submit" class="mt-8" shadow formaction="/register?/create">
            Continue
        </Button>
    </fieldset>
</Grid>