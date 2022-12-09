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
    import type { Nonprofit, NonprofitSearchResults } from 'types/change';
    import Input from '../Input.svelte';
    import Charity from './Charity.svelte';

    export let designated: Nonprofit[] = []
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

    function addCharity(charity: Nonprofit) {
        removeCharity(charity)
        designated = [...designated, charity]

        term = ''
        searchInput?.blur()
    }

    function removeCharity(charity: Nonprofit) {
        designated = designated.filter(d => d.id !== charity.id)
    }
</script>

<div class="w-full max-w-md space-y-5">
    {#if designated?.length > 0}
        <div class="space-y-4">
            {#each designated as item (item.id)}
                <Charity charity={item} editable on:remove={(e) => removeCharity(item)} />
            {/each}
        </div>
        <input type="hidden" name="designated" value={JSON.stringify(designated.map(c => c.id))} />
    {/if}
    <div class="relative bg-white shadow border transition-all border-black focus-within:border-orange-500 focus-within:shadow-orange-500/10" style:border-radius={searchRadius}>
        <div bind:clientHeight={searchInputHeight}>
            <Input bind:value={term} bind:input={searchInput} inconspicuous {loading} type="search" label={designated?.length > 0 ? 'Support another charity' : 'Which charity do you want to support?'} name="search" on:focus={() => searching = true} on:blur={() => searching = false} />
        </div>
        {#if searching && results}
            <div class="px-2" on:mousedown|preventDefault>
                {#if results.length > 0}
                    <div class="py-2 border-t border-gray-200">
                        {#each results as charity (charity.id)}
                            <Charity {charity} on:click={(e) => addCharity(charity)} />
                        {/each}
                    </div>
                {/if}
                <div class="text-center p-4 border-t border-gray-200">
                    {#if results.length <= 0}
                        We couldn't find that charity.
                    {:else}
                        Can't find the charity you're looking for?
                    {/if}
                    <a class="block font-medium mt-2 text-orange-500" href="/request">Request it to be added</a>
                </div>
            </div>
        {/if}
    </div>
</div>
