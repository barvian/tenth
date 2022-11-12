<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fly } from 'svelte/transition';
    import Grid from '~/components/Grid.svelte';
    import Charities from "~/components/Charity/Charities.svelte";
    import type { Nonprofit } from 'types/change';
    import Button from '~/components/Button/Button.svelte';
    import Select from '~/components/Select.svelte';

    export let designated: Nonprofit[]
    export let popular: Nonprofit[]
    export let percent: string

    const dispatch = createEventDispatcher()
</script>

<fieldset>
    <Grid class="mb-7">
        <div class="lg:col-span-7">
            <h1 class="text-4xl leading-tight font-bold">
                Donate
                <Select name="percentage" bind:value={percent}>
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
            {#if !(designated?.length > 0)}
                <p in:fly|local={{y: -50}} class="text-xl mt-5 text-dim">Donated in monthly increments. Cancelable anytime.</p>
            {/if}
        </div>
    </Grid>
    <Charities bind:designated recommended={popular} />
    <input type="hidden" name="designated" value={JSON.stringify(designated)} />
    {#if designated?.length > 0}
        <div in:fly|local={{y: 50}} class="inner mt-8">
            <Button shadow on:click={e => dispatch('continue', e)}>Get started</Button>
        </div>
    {/if}
</fieldset>
