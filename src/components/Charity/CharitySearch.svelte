<!-- <script lang="ts" context="module">
    import type { Nonprofit } from 'types/change';

    export interface DesignatedNonprofit {
        nonprofit: Nonprofit
        split: number
    }
</script> -->

<script lang="ts">
    import { PUBLIC_CHANGE_KEY } from '$env/static/public';
    import debounce from 'lodash/debounce';
    import { createEventDispatcher } from "svelte";
    import type { Nonprofit, NonprofitSearchResults } from 'types/change';
    import Input from '../inputs/Input.svelte';
    import Charity from './Charity.svelte';

    const dispatch = createEventDispatcher()

    let cls = ''
    export { cls as class }
    export let label: string
    let results: Nonprofit[] | null
    let searching = false, loading = false, term = '', searchInput: HTMLInputElement | null = null, searchInputHeight = 999
    $: searchRadius = searchInputHeight/2+'px'

    const limit = 10

    let controller: AbortController
    const search = debounce(async (search_term: string) => {
        controller?.abort()
        controller = new AbortController()
        const signal = controller.signal
        const response: NonprofitSearchResults = await fetch(`https://api.getchange.io/api/v1/nonprofits?`+new URLSearchParams({
            public_key: PUBLIC_CHANGE_KEY,
            search_term,
            limit: limit.toString()
        }), { signal }).then(r => r.ok ? r.json() : Promise.reject(r))
        results = response.nonprofits
        loading = false
    }, 500, { maxWait: 1000 })

    function handleSearch(term: string) {
        if (!term) {
            search.cancel()
            controller?.abort()
            results = null
            loading = false
        } else {
            loading = true
            search(term)
        }
    }
    
    $: handleSearch(term)

    function onClickCharity(charity: Nonprofit) {
        term = ''
        searchInput?.blur()
        dispatch('charity', charity)
    }
</script>

<div class="relative bg-white shadow border transition-all border-black focus-within:border-orange-500 focus-within:shadow-orange-500/10 {cls}" style:border-radius={searchRadius}>
    <div bind:clientHeight={searchInputHeight}>
        <Input bind:value={term} bind:input={searchInput} {loading} type="search" border="border-none" shadow={false} {label} name="search" on:focus={() => searching = true} on:blur={() => searching = false} />
    </div>
    <div class="px-2 overflow-hidden transition-[max-height] {searching && results ? 'max-h-[1200px] duration-500' : 'max-h-0 ease-[cubic-bezier(0,1,0,1)]'}" on:mousedown|preventDefault>
        {#if results && results.length > 0}
            <div class="py-2 border-t border-gray-200">
                {#each results as charity (charity.id)}
                    <Charity {charity} unstyled class="cursor-pointer hover:bg-gray-100 p-3" on:click={() => onClickCharity(charity)} />
                {/each}
            </div>
        {/if}
        <div class="text-center p-4 border-t border-gray-200">
            {#if results && results.length <= 0}
                We couldn't find that charity.
            {:else}
                Can't find the charity you're looking for?
            {/if}
            <a class="block mt-1 text-orange-500 font-medium" href="/request">Request it to be added</a>
        </div>
    </div>
</div>
