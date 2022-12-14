<script lang="ts">
	import { createEventDispatcher, SvelteComponent } from "svelte";
	import { fade, scale } from "svelte/transition";
	import { afterUpdate } from "~/lib/component";
	import Search from "../icons/Search.svelte";
	import Spinner from "../icons/Spinner.svelte";
    import clsx from 'clsx';

    export let name: string
    export let label: string = ''
    export let type: string = 'text'
    export let value: string | null | undefined = ''
    export let required = false
    export let showRequired = true
    export let showDescription = true
    export let descriptionAlign = "text-left"
    export let icon: typeof SvelteComponent | null = null
    export let error: string | null | undefined = undefined
    export let loading = false // only displays if there's an icon or it's a search
    export let placeholder = ''
    export let autocomplete = 'on'
    export let maxlength = 524288
    export let disabled = false
    export let pattern = '.*'
    export let bg = 'bg-white'
    export let border: string = 'border-black focus:border-bank'
    export let shadow: string | boolean = 'not-disabled:shadow focus:shadow-bank/10'
    export let padding = type === 'search' ? 'pl-12 pr-5 pb-3.5 pt-4' : label && !icon ? 'px-4 pb-2 pt-6 placeholder-shown:py-4' : icon ? 'pl-11 py-4 pr-4' : 'p-4'
    export let rounded = type === 'search' ? 'rounded-full' : 'rounded-2xl'
    export let align = type === 'search' ? 'text-center' : ''
    export let textSize = 'text-lg'
    let cls = ''
    export { cls as class }
    export let spellcheck = true

    export let input: HTMLInputElement | null = null

    const dispatch = createEventDispatcher()
    
    const errors: Record<string, string> = {}
    afterUpdate(() => {
        if (error && value) errors[value] = error 
    }, () => [error]) // ignore value changes

    function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
        value = e.currentTarget?.value
        error = errors[value] ?? null
        dispatch('input', e)
    }
</script>

<div class="w-full {cls}">
    <div class="group relative">
        <input bind:this={input} {disabled} {maxlength} {autocomplete} {spellcheck} {name} {pattern} {required} id={name} {type} {value} on:input={handleInput} on:keydown on:focus on:blur placeholder={label || placeholder}
            class:has-error={error}
            class={clsx(bg, border, border && 'has-error:border-red-500 disabled:border-gray-200', shadow, shadow && 'has-error:shadow-red-500/10', rounded, align, textSize, padding, 'w-full peer inherit-case placeholder:normal-case relative transition-all focus:ring-0 focus:ring-offset-0 font-medium placeholder:font-normal', type === 'search' || icon || !label ? 'placeholder:text-gray-450' : 'placeholder:text-transparent')}
        />
        {#if loading && (icon || type === 'search')}
            <div transition:scale|local class="absolute top-1/2 left-5 -translate-y-1/2 text-gray-500 peer-focus:text-bank">
                <Spinner class="h-5" />
            </div>
        {:else if type === 'search'}
            <div transition:scale|local class="absolute top-1/2 left-5 -translate-y-1/2 -mt-[1px] text-gray-500 peer-focus:text-bank">
                <Search class="w-4 transition-colors" />
            </div>
        {:else if icon}
            <svelte:component this={icon} class="w-5 absolute top-1/2 left-4 -translate-y-1/2 -mt-[1px] transition-colors text-gray-500 peer-focus:text-bank " />
        {:else if label}
            <label for={name} class="absolute overflow-hidden text-ellipsis max-w-[calc(100%-theme(space.4)*2)] normal-case whitespace-nowrap pointer-events-none scale-[0.55] text-gray-450 peer-focus:text-bank peer-has-error:text-red-500 peer-focus:peer-placeholder-shown:text-gray-450 [&_span]:opacity-0 peer-placeholder-shown:[&_span]:opacity-100 translate-y-[0.7rem] peer-placeholder-shown:translate-y-[1.1rem] peer-placeholder-shown:scale-100 left-4 ml-[0.05em] top-0 origin-top-left {textSize} transition-all">
                {label}{#if required && showRequired}<span class="transition-opacity">*</span>{/if}
                {#if placeholder}<span class="transition-opacity text-gray-450">({placeholder})</span>{/if}
            </label>
        {/if}
        <slot name="tools" />
    </div>
    {#if error}
        <p in:fade|local class="text-red-600 {descriptionAlign} leading-snug mt-5">{@html error}</p>
    {:else if $$slots.default && showDescription}
        <p in:fade|local class="text-gray-500 {descriptionAlign} leading-snug mt-5"><slot /></p>
    {/if}
</div>