<script lang="ts">
    import type { Nonprofit } from 'types/change';
	
    let cls = ''
    export { cls as class }
    export let inconspicuous = false
    export let charity: Nonprofit | null = null
    let url: URL | null, location: String

    $: if (charity?.website) {
        let site = charity.website
        if (!/^https?:\/\//i.test(site)) site = 'http://'+site
        try {
            url = new URL(site)
            if (!url.hostname?.includes('.')) url = null
        } catch (e) {}
    }
</script>

<div on:click class="rounded-2xl relative flex gap-x-3 items-center {inconspicuous ? '' : 'bg-white border p-4 shadow'} {cls}">
    <img class="w-12 object-fit aspect-square" class:rounded-lg={!charity?.logo_url} src={charity?.logo_url ?? charity?.icon_url} alt="{charity?.name} logo" />
    <div class="flex-1 pt-0.5">
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
    </div>
    <slot name="tools" />
</div>
