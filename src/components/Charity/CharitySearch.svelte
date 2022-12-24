<script lang="ts">
	import { browser } from '$app/environment'
	import clsx, { type ClassValue } from 'clsx'
	import debounce from 'lodash/debounce'
	import { createEventDispatcher } from 'svelte'
	import { clickOutside } from '~/lib/actions'
	import Button from '../forms/Button.svelte'
	import { getFormByIdOrContext } from '../forms/Form.svelte'
	import Input from '../forms/Input.svelte'
	import Charity from './Charity.svelte'

	const dispatch = createEventDispatcher()

	let cls: ClassValue = null
	export { cls as class }
	let formId: string | undefined
	export { formId as form }
	export let addForm: string | undefined = undefined
	export let label: string

	$: form = getFormByIdOrContext(formId)
	$: loading = form?.loading
	$: results = form?.data

	$: formEl = form?.el
	$: if (form)
		form.$on('load', (event: any) => {
			// IMPORTANT: == coerces URL and string types
			if (event.detail?.action && event.detail?.action == $formEl.action) {
				// Don't trigger invalidateAll if we just submit the form,
				// as it screws up searching
				event.preventDefault()
			}
		})

	let searching = false,
		term = '',
		searchInput: HTMLInputElement | null = null,
		searchInputHeight = 999
	$: searchRadius = searchInputHeight / 2 + 'px'

	const search = debounce(() => form?.submit(), 500, { maxWait: 1000 })

	function handleTermChange() {
		if (!browser) return // this will totally mess up SSR otherwise
		if (!term) {
			search.cancel()
			form?.abort()
			// Writing to an undefined store throws an error, but reading doesn't
			if (form) $results = null
		} else search()
	}
	$: term, handleTermChange()
</script>

<div
	class={clsx(
		'relative w-full bg-white shadow border transition-all border-black focus-within:border-orange-500 focus-within:shadow-orange-500/10',
		$results ? 'no-js:!rounded-3xl' : 'no-js:!rounded-full',
		cls
	)}
	style:border-radius={searchRadius}
	use:clickOutside
	on:outclick={() => (searching = false)}
>
	<div bind:clientHeight={searchInputHeight}>
		<Input
			type="search"
			bind:value={term}
			bind:input={searchInput}
			loading={$loading}
			form={formId}
			border="border-none"
			shadow={false}
			{label}
			align="no-js:text-left js:text-center"
			name="q"
			autofocus={$loading && searching ? true : null}
			on:focus={() => (searching = true)}
			{...$$restProps}
		>
			<Button
				form={formId}
				class="absolute inset-y-2 right-2 js:invisible"
				width="w-min"
				padding="px-4"
				rounded="rounded-full"
				shadow={false}
			>
				Search
			</Button>
		</Input>
	</div>
	<div
		class={clsx(
			'px-2 overflow-hidden no-js:!max-h-max transition-[max-height]',
			searching && $results
				? 'max-h-[1200px] duration-500'
				: 'max-h-0 ease-[cubic-bezier(0,1,0,1)]'
		)}
		on:mousedown|preventDefault
	>
		{#if $results && $results.length > 0}
			<div class="py-2 border-t border-gray-200">
				{#each $results as charity (charity.id)}
					<Charity
						as="button"
						{charity}
						bg="hover:bg-gray-100"
						padding="p-3"
						shadow={false}
						border={false}
						titleSize="text-lg"
						titleMargin="mb-1"
						imgWidth="w-12"
						class="cursor-pointer"
						form={addForm}
						name="change_id"
						value={charity.id}
						on:click={(event) => {
							const cancel = !dispatch('select', charity, { cancelable: true })
							if (cancel) event.preventDefault()

							// If we do this immediately there's a race condition
							window.requestAnimationFrame(() => {
								term = ''
								searchInput?.blur()
							})
						}}
					/>
				{/each}
			</div>
		{/if}
		{#if $results}
			<div class="text-center p-4 border-t border-gray-200">
				{#if $results.length <= 0}
					We couldn't find that charity.
				{:else}
					Can't find the charity you're looking for?
				{/if}
				<a class="block mt-1 text-orange-500 font-medium" href="/request"
					>Request it to be added</a
				>
			</div>
		{/if}
	</div>
</div>
