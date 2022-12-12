<script lang="ts">
	import Spinner from "./icons/Spinner.svelte";
    
    export let href: string | null | undefined = null
    export let type = 'button'
    export let loading = false
    export let disabled = false
    export let inconspicuous = false
    export let bg = inconspicuous ? 'bg-transparent' : 'bg-black'
    export let color = inconspicuous ? 'text-black' : 'text-white'
    export let rounded = 'rounded-2xl'
    export let width = 'w-full'
    let cls = ''
    export { cls as class }
</script>

<svelte:element this={href ? 'a' : 'button'} {href} disabled={loading || disabled} {type} class="{cls} {width} {loading || disabled ? 'cursor-not-allowed': inconspicuous ? '' : 'hover:-translate-y-1 hover:shadow-elevated active:shadow active:translate-y-0 active:transition-none'} disabled:cursor-not-allowed {color} {rounded} {bg} whitespace-nowrap overlap justify-items-center relative {inconspicuous ? '' : 'text-lg shadow px-6 py-4 disabled:bg-gray-200 disabled:shadow-transparent transition-all font-medium'}" on:click>
    <span class="block w-full" class:invisible={loading}><slot /></span>
    {#if loading}<Spinner class="h-5" />{/if}
</svelte:element>