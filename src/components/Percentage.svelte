<script lang="ts">
    import Spinner from './icons/Spinner.svelte';
    
    const options = [0.33, 0.25, 0.2, 0.15, 0.1, 0.05, 0.03, 0.02, 0.01]
    
    export let loading = false
    export let value: number = 0.1
</script>

<div class="relative inline-block align-middle">
    <select name="percentage" disabled={loading} class="appearance-none bg-transparent border-none opacity-0 absolute inset-0 peer" bind:value on:change>
        {#each options as p}
            <option value={p}>{p*100}%</option>
        {/each}
    </select>
    <label class="relative whitespace-nowrap flex pl-0.5 pr-1 items-baseline text-orange-500 border-current leading-extra-tight border-b-4 border-dotted pointer-events-none peer-disabled:text-gray-300" for="percentage">
        {#if loading}<Spinner class="inline-block align-middle h-7 mr-1.5" />{/if}
        {value*100}
        <svg class="h-[0.7em] ml-1" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 25L9 31L15 25" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="4" stroke-linecap="square" stroke-linejoin="round"/>
            <path d="M3 8L9 2L15 8" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="4" stroke-linecap="square" stroke-linejoin="round"/>
        </svg>            
    </label>
</div>%