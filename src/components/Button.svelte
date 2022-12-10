<script lang="ts">
	import Spinner from "./icons/Spinner.svelte";
    
    export let href: string | null | undefined = null
    export let type = 'button'
    export let loading = false
    export let disabled = false
    export let inconspicuous = false
    export let color = 'text-white'
    export let width = 'w-full'
    let cls = ''
    export { cls as class }
</script>

<div class="relative {width} {cls}">
    <svelte:element this={href ? 'a' : 'button'} {href} disabled={loading || disabled} {type} class="{width} {loading || disabled ? 'cursor-not-allowed': inconspicuous ? '' : 'hover:-translate-y-1 hover:shadow-elevated active:shadow active:translate-y-0 active:transition-none'} disabled:cursor-not-allowed {color} whitespace-nowrap overlap justify-items-center relative text-lg {inconspicuous ? '' : 'bg-black shadow rounded-2xl px-6 py-4 disabled:bg-gray-200 disabled:shadow-transparent'} transition-all font-medium" on:click>
        <span class:invisible={loading}><slot /></span>
        {#if loading}<Spinner />{/if}
    </svelte:element>
</div>