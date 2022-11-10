<script lang="ts">
    import { page } from '$app/stores';
    import Button from "~/components/Button/Button.svelte";
    import Grid from "~/components/Grid.svelte";
    import Input from "~/components/Input.svelte";

    export let loading = false
</script>

<Grid>
    <fieldset class="lg:col-span-7">
        <h1 class="text-3xl font-bold mb-7">Create an account</h1>
        <div class="grid grid-cols-2 gap-6">
            <Input value={$page.form?.values.firstName ?? ''} required shadow type="text" name="first-name" label="First name" />
            <Input value={$page.form?.values.lastName ?? ''} required shadow type="text" name="last-name" label="Last name" />
            <Input value={$page.form?.values.email ?? ''} class="col-span-full" required shadow type="email" name="email" label="Email">
                We'll send you a code to verify your email address.
            </Input>
        </div>
        <Button {loading} type="submit" formaction="/register?/send" class="mt-8" shadow>
            Continue
        </Button>
    </fieldset>
</Grid>