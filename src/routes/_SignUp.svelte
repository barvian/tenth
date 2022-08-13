<script lang="ts">
    import Input from "~/components/Input.svelte";
    import Button from "~/components/Button/Button.svelte";
    import Grid from "~/components/Grid.svelte";

    export let firstName: string, lastName: string, email: string
</script>


<Grid>
    <form class="lg:col-span-7" action="javascript:void(0);" on:submit>
        <h1 class="text-3xl font-bold mb-7">Create an account</h1>
        <div class="grid grid-cols-2 gap-6">
            <Input bind:value={firstName} required shadow type="text" name="first" label="First name" />
            <Input bind:value={lastName} required shadow type="text" name="last" label="Last name" />
            <Input bind:value={email} class="col-span-full" required shadow type="email" name="email" label="Email">
                We'll send you a code to verify your email address.
            </Input>
        </div>
        <Button type="submit" class="mt-4" shadow>
            Continue
        </Button>
    </form>
</Grid>