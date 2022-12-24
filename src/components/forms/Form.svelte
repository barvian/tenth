<script lang="ts" context="module">
	import { getContext, type InjectionKey } from 'svelte-typed-context'
	import type { Writable } from 'svelte/store'
	import { getFormById } from './FormProvider.svelte'

	const key: InjectionKey<{
		el: Writable<HTMLFormElement>
		id: Writable<string>
		$on: (eventName: string, handler: (event: CustomEvent) => void) => void
		abort: () => void
		submit: () => void
		loading: Writable<boolean>
		complete: Writable<boolean>
		values: Writable<Record<string, string> | null | undefined>
		invalid: Writable<Record<string, string> | null | undefined>
		data: Writable<any>
	}> = Symbol()

	export const getFormByIdOrContext = (id?: string) =>
		id ? getFormById(id)?.$$.context.get(key) : getContext(key)
</script>

<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { toast } from '@zerodevx/svelte-toast'
	import { createEventDispatcher } from 'svelte'
	import { setContext } from 'svelte-typed-context'
	import { get_current_component } from 'svelte/internal'
	import { writable } from 'svelte/store'
	import { registerForm } from './FormProvider.svelte'

	export let id: string
	export let action = ''
	let cls = 'contents'
	export { cls as class }

	const dispatch = createEventDispatcher()

	export const el = writable<HTMLFormElement>()
	export const loading = writable(false)
	export const complete = writable(false)
	export const values = writable<Record<string, string> | null | undefined>()
	export const invalid = writable<Record<string, string> | null | undefined>()
	export const data = writable<any>()

	const handlePageUpdates = () => {
		$complete =
			$page.status === 200 && $page.form?.id != null && $page.form?.id == id
		if ($page.form?.id != null && $page.form?.id == id) {
			$values = $page.form?.values
			$invalid = $page.form?.invalid
			$data = $page.form?.data
		}
	}
	$: $page, handlePageUpdates()

	let abortController: AbortController
	const submit: SubmitFunction = ({
		cancel,
		controller,
		action,
		data: formData
	}) => {
		if (!dispatch('submit', null, { cancelable: true })) return cancel()

		$loading = true
		abortController = controller
		return async ({ result }) => {
			if (
				result.type === 'success' &&
				dispatch('load', { result, action, formData }, { cancelable: true })
			) {
				// TODO: wouldn't need this at all if client actions were supported,
				// as they could just invalidate things selectively
				await invalidateAll()
			} else if (result.type === 'error') {
				dispatch('error', { result, action, formData })
			}

			const apply = dispatch('loadend', { result, action, formData })

			// On the client, let's skip the error boundary and just show a toast
			if (result.type === 'error') {
				toast.push(result.error.message, { classes: ['error'] })
			} else if (apply) {
				await applyAction(result)
			}

			if (result.type === 'success')
				dispatch('complete', { result, action, formData })
			$loading = false
		}
	}

	const triggerSubmit = () => {
		$el?.triggerSubmit()
	}
	export { triggerSubmit as submit }

	export const abort = () => {
		abortController?.abort()
		$loading = false
	}

	let idStore = writable<string>()
	$: $idStore = id

	const current = get_current_component()
	$: registerForm(id, current)

	setContext(key, {
		el,
		$on: (name, handler) => current.$on && current.$on(name, handler),
		id: idStore,
		abort,
		submit: triggerSubmit,
		loading,
		complete,
		values,
		invalid,
		data
	})
</script>

{#if $$slots.complete && $complete}
	<slot name="complete" values={$values} data={$data} />
{:else}
	<form
		bind:this={$el}
		{action}
		method="post"
		use:enhance={submit}
		class={cls}
		{id}
	>
		<!-- Keep track of which form the request came from -->
		<input type="hidden" name="$$id" value={id} />
		<slot
			loading={$loading}
			complete={$complete}
			invalid={$invalid}
			values={$values}
			data={$data}
			submit={triggerSubmit}
		/>
	</form>
{/if}
