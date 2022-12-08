<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Nonprofit } from 'types/change';

    export let charity: Nonprofit | null = null
    let url: URL | null, location: String
    // export let split: number = null
    export let editable = false

    $: if (charity?.website) {
        let site = charity.website
        if (!/^https?:\/\//i.test(site)) site = 'http://'+site
        try {
            url = new URL(site)
            if (!url.hostname?.includes('.')) url = null
        } catch (e) {}
    }

    const dispatch = createEventDispatcher()
    
    function handleRemoveClick(e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
        dispatch('remove', e);
    }
</script>

<div on:click class="bg-white rounded-2xl relative flex gap-x-3 items-center {editable ? 'border p-4 shadow' : 'cursor-pointer hover:bg-gray-100 p-3'}">
    <slot name="image">
        <img class="w-12 object-fit aspect-square" class:rounded-lg={!charity?.logo_url} src={charity?.logo_url ?? charity?.icon_url} alt="{charity?.name} logo" />
    </slot>
    <div class="flex-1 pt-0.5">
        <slot>
            <h3 class="font-medium text-lg leading-tight mb-1">{charity?.name}</h3>
            <span class="block text-gray-500 leading-none break-words w-full">
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
    {#if editable}
        <button type="button" on:click={handleRemoveClick} class="py-2 pl-2 transition-colors text-gray-300 hover:text-red-500">
            <svg class="h-3.5" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.625 2.5L2.625 16.5" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="3" stroke-linecap="square" stroke-linejoin="round"/>
                <path d="M16.625 16.5L2.625 2.5" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="3" stroke-linecap="square" stroke-linejoin="round"/>
            </svg>
        </button>
    {/if}
</div>
