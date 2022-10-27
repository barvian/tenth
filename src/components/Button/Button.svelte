<script lang="ts">
	import { scale } from "svelte/transition";
    import Spinner from "../icons/Spinner.svelte";
    import Shadow from '../Shadow.svelte'
    
    export let type = 'button'
    export let formaction: string = ''
    export let fullWidth = false
    export let shadow = false
    export let loading = false
    let cls = ''
    export { cls as class }
</script>

<div class="round-2xl relative {fullWidth ? 'w-full' : 'w-min'} {cls}">
    {#if shadow}<Shadow class="top-1.5 left-1" />{/if}
    <button disabled={loading} {type} {formaction} class="{fullWidth ? 'w-full' : 'w-min'} {loading ? 'cursor-not-allowed': ''} bg-dark text-white whitespace-nowrap overlap justify-items-center relative rounded text-lg px-5 py-4 transition-transform font-medium {shadow && !loading && 'hover:-translate-y-1 active:translate-y-0 active:transition-none'}" on:click>
        <span class:invisible={loading}><slot /></span>
        {#if loading}<Spinner class="text-white" />{/if}
    </button>
</div>