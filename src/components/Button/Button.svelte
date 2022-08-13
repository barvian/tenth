<script lang="ts">
    import Spinner from "../icons/Spinner.svelte";
    import Shadow from '../Shadow.svelte'
    
    export let type = 'button'
    export let fullWidth = false
    export let shadow = false
    export let loading = false
    let cls = ''
    export { cls as class }
</script>

<div class="round-2xl relative {fullWidth ? 'w-full' : 'w-min'} {cls}">
    {#if shadow}<Shadow class="top-1.5 left-1" />{/if}
    <button disabled={loading} {type} class="{fullWidth ? 'w-full' : 'w-min'} {loading ? 'cursor-not-allowed': ''} bg-dark text-white whitespace-nowrap relative rounded text-lg px-5 py-4 transition-transform font-medium {shadow && !loading && 'hover:-translate-y-1 active:translate-y-0 active:transition-none'}" on:click>
        <slot />
        {#if loading}<Spinner class="inline-block align-middle text-white" />{/if}
    </button>
</div>