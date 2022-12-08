<script lang="ts">
	import Spinner from "./icons/Spinner.svelte";
    
    export let type = 'button'
    export let formaction: string = ''
    export let loading = false
    let cls = ''
    export { cls as class }
</script>

<div class="relative w-full {cls}">
    <button disabled={loading} {type} {formaction} class="w-full {loading ? 'cursor-not-allowed': ''} bg-black shadow text-white whitespace-nowrap overlap justify-items-center relative rounded-2xl text-lg px-5 py-4 transition-all font-medium {!loading && 'hover:-translate-y-1 hover:shadow-elevated active:shadow active:translate-y-0 active:transition-none'}" on:click>
        <span class:invisible={loading}><slot /></span>
        {#if loading}<Spinner class="text-white" />{/if}
    </button>
</div>