<script lang="ts">
    import type { Nonprofit } from 'types/change';
    import { createEventDispatcher } from "svelte";
    import Shadow from '~/components/Shadow.svelte';

    export let charity: Nonprofit | null = null
    let url: URL | null, location: String
    export let placeholder = false
    // export let split: number = null
    export let href: string | null = null
    export let editable = false

    $: tag = href ? 'a' : 'div'

    $: if (charity?.website) {
        let site = charity.website
        if (!/^https?:\/\//i.test(site)) site = 'http://'+site
        try {
            url = new URL(site)
            if (!url.hostname?.includes('.')) url = null
        } catch (e) {}
    }

    const dispatch = createEventDispatcher()
    
    function handleRemoveClick(e) {
        dispatch('remove', e);
    }
</script>

<div class="relative round-2xl">
    {#if !placeholder}<Shadow class="left-1 top-1.5" />{/if}
    <svelte:element this={tag} {href} on:click class="h-full min-h-[theme(height.24)] rounded border relative z-0 flex gap-x-3 items-center px-5 py-3 {placeholder ? 'border-dashed hover:border-solid' : 'bg-white'} {!placeholder && !editable && 'cursor-pointer transition-transform hover:-translate-y-1 active:translate-y-0 active:transition-none'}">
        <slot name="image">
            <img class="w-12 object-fit aspect-square" class:rounded-lg={!charity?.logo_url} src={charity?.logo_url ?? charity?.icon_url} alt="{charity?.name} logo" />
        </slot>
        <div class="flex-1 pt-0.5">
            <slot>
                <h3 class="font-medium text-lg leading-tight mb-1">{charity?.name}</h3>
                <span class="block text-dim leading-none break-words w-full">
                    {#if url}
                        {url?.hostname?.replace(/^wwww*\./i,'')+url?.pathname?.replace(/\/$/, '')} <!-- some erroneously have wwww.-->
                    {:else if charity?.city && charity?.state}
                        <span class="capitalize">{charity?.city.toLocaleLowerCase()}</span>, <span class="uppercase">{charity.state}</span>
                    {:else}
                        EIN: {charity?.ein}
                    {/if}
                </span>
            </slot>
        </div>
        <!-- {#if split != null}
            <div>{split * 100}%</div>
        {/if} -->
    </svelte:element>
    {#if editable}
        <button on:click={handleRemoveClick} class="rounded-full p-2 bg-red-400 text-white absolute -top-1 -right-1 transition-transform hover:-translate-y-0.5 active:translate-y-0 active:transition-none">
            <svg class="h-3.5" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.625 2.5L2.625 16.5" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="3" stroke-linecap="square" stroke-linejoin="round"/>
                <path d="M16.625 16.5L2.625 2.5" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="3" stroke-linecap="square" stroke-linejoin="round"/>
            </svg>
        </button>
    {/if}
</div>