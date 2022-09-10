<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Button from '~/components/Button/Button.svelte';
import Grid from '~/components/Grid.svelte';

    const dispatch = createEventDispatcher();
    
    export let email = ''

    function onChangeEmail() {
        dispatch('changeemail');
    }
</script>

<Grid>
    <form class="lg:col-span-7" action="javascript:void(0);" on:submit>
        <h1 class="text-3xl font-bold mb-5">Verify your email</h1>
        <p class="text-lg leading-snug mb-5">Please enter the 6-digit code we sent to {email}. <button on:click={onChangeEmail}>Change email</button>.</p>
        <div class="grid grid-cols-2 gap-6">
        </div>
        <Button type="submit" class="mt-4" shadow>
            Continue
        </Button>
    </form>
</Grid>