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
    import { fade } from 'svelte/transition';
    import type { Nonprofit, NonprofitSearchResults } from 'types/change';
    import Input from '../Input.svelte';
    import Charity from './Charity.svelte';
    import CharityList from './CharityList.svelte';

    export let recommended: Nonprofit[]
    export let designated: Nonprofit[] = []
    let results: Nonprofit[] | null
    let searching = false, term = '', searchInput: HTMLInputElement | null = null

    const limit = 50

    type CharitiesView = 'designated' | 'recommended' | 'results'
    let view: CharitiesView = 'designated'

    let controller: AbortController
    const search = debounce(async (search_term: string) => {
        controller?.abort()
        controller = new AbortController()
        const signal = controller.signal
        const response: NonprofitSearchResults = await fetch(`https://api.getchange.io/api/v1/nonprofits?`+new URLSearchParams({
            public_key: PUBLIC_CHANGE_KEY,
            search_term,
            limit: limit.toString()
        }), { signal }).then(res => res.json())
        results = response.nonprofits
    }, 500, { maxWait: 1000 })

    function handleSearch(term: string) {
        if (!term) {
            search.cancel()
            controller?.abort()
            results = null
        } else search(term)
    }
    
    $: handleSearch(term)
    $: if (results) view = 'results'
    else if (searching || !designated || designated.length === 0) view = 'recommended'
    else if (!searching) view = 'designated'

    function addCharity(charity: Nonprofit) {
        const i = designated.findIndex(d => d.id === charity.id)
        if (i >= 0) designated = [designated.splice(i, 1)[0], ...designated]
        else designated = [charity, ...designated]

        term = ''
        searchInput?.blur()
    }

    function removeCharity(charity: Nonprofit) {
        designated = designated.filter(d => d.id !== charity.id)
    }
</script>


<div class="inner mb-3">
    <Input bind:value={term} bind:input={searchInput} width="2/5" type="search" label={designated?.length > 0 ? 'Designate another charity (name, EIN)' : 'Which charity do you want to support?'} name="search" shadow on:focus={() => searching = true} on:blur={() => searching = false} />
        <h2 class="mt-7 text-xl font-medium">
            {#if view === 'results'}
                <span in:fade|local={{duration: 250, delay: 250}} out:fade|local={{duration:250}}>
                    {results?.length === limit ? limit+'+' : results?.length} result{#if results?.length !== 1}s{/if}</span>
            {:else if view === 'recommended'}
                <span in:fade|local={{duration: 250, delay: 250}} out:fade|local={{duration:250}}>Popular charities</span>
            {:else if view === 'designated'}
                <span in:fade|local={{duration: 250, delay: 250}} out:fade|local={{duration:250}}>Designated charities</span>
            {/if}
        </h2>
</div>
<div class="overlap">
    {#if view === 'results'}
        <CharityList on:mousedown={(e) => {e.preventDefault()}}>
            {#each results as charity (charity.id)}
                <Charity {charity} on:click={(e) => addCharity(charity)} />
            {/each}
            <Charity placeholder href="/request">
                not seeing yo shit?
            </Charity>
        </CharityList>
    {:else if view === 'recommended'}
        <CharityList on:mousedown={(e) => {e.preventDefault()}}>
            {#each recommended as charity (charity.id)}
                <Charity {charity} on:click={(e) => addCharity(charity)} />
            {/each}
        </CharityList>
    {:else if view === 'designated'}
        <CharityList>
            {#each designated as item (item.id)}
                <Charity charity={item} editable on:remove={(e) => removeCharity(item)} />
            {/each}
        </CharityList>
    {/if}
</div>
