<script lang="ts">
    import { createEventDispatcher, SvelteComponent } from "svelte";
	import { scale } from "svelte/transition";
    import Search from "./icons/Search.svelte";
	import Spinner from "./icons/Spinner.svelte";
    import Shadow from "./Shadow.svelte";

    export let name: string
    export let label: string = ''
    export let type: string = 'text'
    export let shadow = false
    export let width = 'w-full'
    export let value = ''
    export let required = false
    export let showRequired = true
    export let icon: typeof SvelteComponent | null = null
    export let loading = false // only displays if there's an icon or it's a search
    export let placeholder = ''
    export let autocomplete = 'on'
    export let maxlength = 524288
    let cls = ''
    export { cls as class }
    export let spellcheck = true

    export let input: HTMLInputElement | null = null

    const dispatch = createEventDispatcher()
    
    function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
        value = e.currentTarget?.value
        dispatch('input', e);
    }
</script>

<div class={cls}>
    <div class="group relative {width} {type === 'search' ? 'round-full' : 'round-2xl'}">
        {#if shadow}<Shadow class="top-1.5 left-1" />{/if}
        <input bind:this={input} {maxlength} {autocomplete} {spellcheck} {name} {required} id={name} {type} {value} on:input={handleInput} on:focus on:blur placeholder={label || placeholder} class="w-full peer text-lg inherit-case placeholder:normal-case {type === 'search' ? 'pl-12 pr-5 pb-2.5 pt-3 placeholder:text-dim' : (icon || !label ? 'pl-11 py-3.5 pr-4 placeholder:text-dim/50' : 'px-4 pb-2 pt-5 placeholder-shown:pb-3.5 placeholder-shown:pt-3.5 placeholder:text-transparent')} placeholder:font-normal relative transition-all border-black {!shadow && 'border-black/[0.2]'} focus:border-primary focus:ring-4 focus:ring-primary/[.2] rounded font-medium" />
        {#if loading && (icon || type === 'search')}
            <div transition:scale|local class="absolute top-1/2 left-5 -translate-y-1/2 peer-focus:text-primary">
                <Spinner />
            </div>
        {:else if type === 'search'}
            <div transition:scale|local class="absolute top-1/2 left-5 -translate-y-1/2 -mt-[1px] peer-focus:text-primary">
                <Search class="w-4 text-dim" />
            </div>
        {:else if icon}
            <svelte:component this={icon} class="w-5 absolute top-1/2 left-4 -translate-y-1/2 -mt-[1px] transition-colors text-dim peer-focus:text-primary " />
        {:else if label}
            <label for={name} class="absolute normal-case whitespace-nowrap pointer-events-none scale-[0.55] text-dim peer-focus:text-primary peer-focus:peer-placeholder-shown:text-dim [&_span]:opacity-0 peer-placeholder-shown:[&_span]:opacity-100 translate-y-[calc(theme(padding.1)*2.25)] peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 left-4 ml-[0.05em] top-0 origin-top-left text-lg transition-all">
                {label}{#if required && showRequired}<span class="transition-opacity">*</span>{/if}
                {#if placeholder}<span class="transition-opacity text-dim/50">({placeholder})</span>{/if}
            </label>
        {/if}
    </div>
    {#if $$slots.default}<p class="text-dim leading-snug {shadow ? 'mt-5' : 'mt-2'}"><slot /></p>{/if}
</div>