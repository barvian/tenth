<script lang="ts">
	import Spinner from "./icons/Spinner.svelte";
    
    export let href: string | null | undefined = null
    export let type = 'button'
    export let loading = false
    export let disabled = false
    export let width = 'w-full'
    let cls = ''
    export { cls as class }
</script>

<div class="relative {width} {cls}">
    <svelte:element this={href ? 'a' : 'button'} {href} disabled={loading || disabled} {type} class="{width} {loading ? 'cursor-not-allowed': ''} bg-black shadow disabled:bg-gray-200 disabled:shadow-transparent disabled:cursor-not-allowed text-white whitespace-nowrap overlap justify-items-center relative rounded-2xl text-lg px-6 py-4 transition-all font-medium {!loading && 'hover:-translate-y-1 hover:shadow-elevated active:shadow active:translate-y-0 disabled:hover:translate-y-0 active:transition-none'}" on:click>
        <span class:invisible={loading}><slot /></span>
        {#if loading}<Spinner class="text-white" />{/if}
    </svelte:element>
</div>