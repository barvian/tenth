<script lang="ts">
    import { createEventDispatcher, SvelteComponent } from "svelte";
    import { fade, scale } from "svelte/transition";
	import { afterUpdate } from "~/lib/component";
    import Search from "./icons/Search.svelte";
    import Spinner from "./icons/Spinner.svelte";

    export let name: string
    export let label: string = ''
    export let type: string = 'text'
    export let value = ''
    export let required = false
    export let showRequired = true
    export let showDescription = true
    export let inconspicuous = false
    export let icon: typeof SvelteComponent | null = null
    export let error: string | null | undefined = undefined
    export let loading = false // only displays if there's an icon or it's a search
    export let placeholder = ''
    export let autocomplete = 'on'
    export let maxlength = 524288
    export let disabled = false
    let cls = ''
    export { cls as class }
    export let spellcheck = true

    export let input: HTMLInputElement | null = null

    const dispatch = createEventDispatcher()
    
    let lastError: string | null | undefined, errorValue: string // the value at the time of the error
    afterUpdate(() => {
        if (error) {
            lastError = error
            errorValue = value
        }
    }, () => [error])

    function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
        value = e.currentTarget?.value
        error = (value === errorValue) ? lastError : null
        dispatch('input', e);
    }
</script>

<div class="w-full {cls}">
    <div class="group relative">
        <input bind:this={input} {disabled} {maxlength} {autocomplete} {spellcheck} {name} {required} id={name} {type} {value} on:input={handleInput} on:focus on:blur placeholder={label || placeholder} class="w-full disabled:border-gray-200 disabled:shadow-transparent disabled:cursor-not-allowed {inconspicuous ? 'bg-transparent border-none' : 'bg-white shadow border-black focus:border-orange-500 focus:shadow-orange-500/10'} peer text-lg inherit-case placeholder:normal-case {type === 'search' ? 'pl-12 pr-5 pb-3.5 pt-4 text-center placeholder:text-gray-450' : (icon || !label ? 'pl-11 py-4 pr-4 placeholder:text-gray-450' : 'px-4 pb-2 pt-6 placeholder-shown:py-4 placeholder:text-transparent')} placeholder:font-normal relative transition-all focus:ring-0 focus:ring-offset-0 {type === 'search' ? 'rounded-full' : 'rounded-2xl'} font-medium {!inconspicuous && error ? '!border-red-500 !shadow-red-500/10' : ''}" />
        {#if loading && (icon || type === 'search')}
            <div transition:scale|local class="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500 peer-focus:text-orange-500">
                <Spinner />
            </div>
        {:else if type === 'search'}
            <div transition:scale|local class="absolute top-1/2 left-5 -translate-y-1/2 -mt-[1px] text-gray-500 peer-focus:text-orange-500">
                <Search class="w-4 transition-colors" />
            </div>
        {:else if icon}
            <svelte:component this={icon} class="w-5 absolute top-1/2 left-4 -translate-y-1/2 -mt-[1px] transition-colors text-gray-500 peer-focus:text-orange-500 " />
        {:else if label}
            <label for={name} class="absolute normal-case whitespace-nowrap pointer-events-none scale-[0.55] text-gray-450 peer-focus:text-orange-500 peer-focus:peer-placeholder-shown:text-gray-450 [&_span]:opacity-0 peer-placeholder-shown:[&_span]:opacity-100 translate-y-[0.7rem] peer-placeholder-shown:translate-y-[1.1rem] peer-placeholder-shown:scale-100 left-4 ml-[0.05em] top-0 origin-top-left text-lg transition-all">
                {label}{#if required && showRequired}<span class="transition-opacity">*</span>{/if}
                {#if placeholder}<span class="transition-opacity text-gray-450">({placeholder})</span>{/if}
            </label>
        {/if}
    </div>
    {#if error}
        <p in:fade|local class="text-red-600 leading-snug mt-5">{@html error}</p>
    {:else if $$slots.default && showDescription}
        <p in:fade|local class="text-gray-500 leading-snug {disabled ? 'mt-3' : 'mt-5'}"><slot /></p>
    {/if}
</div>