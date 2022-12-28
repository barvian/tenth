<script lang="ts">
	import clsx, { type ClassValue } from 'clsx'
	import { createEventDispatcher, SvelteComponent } from 'svelte'
	import { fade, scale } from 'svelte/transition'
	import Search from '../icons/Search.svelte'
	import Spinner from '../icons/Spinner.svelte'
	import omit from 'lodash/omit'
	import { getFormByIdOrContext } from './Form.svelte'
	import { browser } from '$app/environment'

	let formId: string | undefined = undefined
	export { formId as form }
	$: form = getFormByIdOrContext(formId)
	$: formValues = form?.values
	$: formInvalids = form?.invalid

	export let name: string | undefined = undefined
	export let label = ''
	export let type = 'text'
	export let value: any = undefined
	export let required = false
	export let showRequired = true
	export let description = ''
	export let showDescription = true
	export let descriptionAlign: ClassValue = 'text-left'
	export let icon: typeof SvelteComponent | null = null
	export let error: string | null | undefined = undefined
	export let invalid = false
	export let loading = false // only displays if there's an icon or it's a search
	export let placeholder = ''
	export let width: ClassValue = 'w-full'
	export let bg: ClassValue = 'bg-white'
	export let border: ClassValue = 'border-black focus:border-orange-500'
	export let shadow: ClassValue =
		'not-disabled:shadow focus:shadow-orange-500/10'
	export let padding: ClassValue =
		type === 'search'
			? 'pl-12 pr-5 pb-3.5 pt-4'
			: label && !icon
			? 'px-4 pb-2 pt-6 placeholder-shown:py-4'
			: icon
			? 'pl-11 py-4 pr-4'
			: 'p-4'
	export let rounded: ClassValue =
		type === 'search' ? 'rounded-full' : 'rounded-2xl'
	export let align: ClassValue = type === 'search' && 'text-center'
	export let textSize: ClassValue = 'text-lg'
	export let labelColor: ClassValue = 'text-gray-500 peer-focus:text-orange-500'
	let cls: ClassValue = undefined
	export { cls as class }

	export let input: HTMLInputElement | null = null

	const dispatch = createEventDispatcher()

	const handleFormValuesUpdate = () => {
		// In SSR, fill the value from the form value (client can handle itself)
		if (!browser && $formValues && name && $formValues[name] != null)
			value = $formValues[name]
	}
	$: $formValues, handleFormValuesUpdate()

	// Order matters with these next two:
	const handleFormInvalidsUpdate = () => {
		if ($formInvalids && name && $formInvalids[name])
			error = $formInvalids[name]
	}
	$: $formInvalids, handleFormInvalidsUpdate()

	const errors: Record<string, string> = {}
	const handleErrorUpdate = () => {
		if (error && value) errors[value] = error
	}
	$: error, handleErrorUpdate()

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		value = e.currentTarget?.value
		error = errors[value] ?? null
		if ($formInvalids && name) {
			if (error) $formInvalids[name] = error
			else $formInvalids = omit($formInvalids, name)
		}
		dispatch('input', e)
	}
</script>

{#if type === 'hidden'}
	<input bind:this={input} {...$$restProps} {type} {name} {value} />
{:else}
	<div class="{width} {cls}">
		<div class="group relative">
			<input
				bind:this={input}
				{...$$restProps}
				{name}
				{required}
				id={name}
				form={formId}
				{type}
				value={value || ''}
				on:input={handleInput}
				on:keydown
				on:focus
				on:blur
				placeholder={label || placeholder}
				aria-invalid={Boolean(invalid || error)}
				class={clsx(
					bg,
					border,
					border && 'invalid:border-red-500 disabled:border-gray-200',
					shadow,
					shadow && 'invalid:shadow-red-500/10',
					rounded,
					align,
					textSize,
					padding,
					'w-full peer inherit-case placeholder:normal-case relative transition-all focus:ring-0 focus:ring-offset-0 font-medium placeholder:font-normal',
					type === 'search' || icon || !label
						? 'placeholder:text-gray-450'
						: 'placeholder:text-transparent'
				)}
			/>
			{#if loading && (icon || type === 'search')}
				<div
					transition:scale|local
					class={clsx('absolute top-1/2 left-5 -translate-y-1/2', labelColor)}
				>
					<Spinner class="h-5" />
				</div>
			{:else if type === 'search'}
				<div
					transition:scale|local
					class={clsx(
						'absolute top-1/2 left-5 -translate-y-1/2 -mt-[1px]',
						labelColor
					)}
				>
					<Search class="w-4 transition-colors" />
				</div>
			{:else if icon}
				<svelte:component
					this={icon}
					class={clsx(
						'w-5 absolute top-1/2 left-4 -translate-y-1/2 -mt-[1px] transition-colors',
						labelColor
					)}
				/>
			{:else if label}
				<label
					for={name}
					class={clsx(
						labelColor,
						'absolute overflow-hidden text-ellipsis max-w-[calc(100%-theme(space.4)*2)] normal-case whitespace-nowrap pointer-events-none scale-[0.55] peer-invalid:text-red-500 peer-focus:peer-placeholder-shown:text-gray-450 [&_span]:opacity-0 peer-placeholder-shown:[&_span]:opacity-100 translate-y-[0.7rem] peer-placeholder-shown:translate-y-[1.1rem] peer-placeholder-shown:scale-100 left-4 ml-[0.05em] top-0 origin-top-left {textSize} transition-all'
					)}
				>
					{label}{#if required && showRequired}<span class="transition-opacity"
							>*</span
						>{/if}
					{#if placeholder}<span class="transition-opacity text-gray-450"
							>({placeholder})</span
						>{/if}
				</label>
			{/if}
			<slot />
		</div>
		{#if error}
			<p
				in:fade|local
				class="text-red-600 {descriptionAlign} leading-snug mt-4"
				role="alert"
			>
				{@html error}
			</p>
		{:else if description}
			{#if showDescription}
				<p
					in:fade|local
					class="text-gray-500 {descriptionAlign} leading-snug mt-4"
				>
					{@html description}
				</p>
			{:else}
				<noscript>
					<p class="text-gray-500 {descriptionAlign} leading-snug mt-4">
						{@html description}
					</p>
				</noscript>
			{/if}
		{/if}
	</div>
{/if}
