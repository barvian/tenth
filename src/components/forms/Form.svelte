<script lang="ts" context="module">
	import { getContext, type InjectionKey } from 'svelte-typed-context'
	import type { Writable } from 'svelte/store'
	import { getFormById } from './FormProvider.svelte'

	const key: InjectionKey<{
		el: Writable<HTMLFormElement>
		id: Writable<string>
		$on: (eventName: string, handler: (event: CustomEvent) => void) => void
		abort: () => void
		submit: () => Promise<void>
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
	import {
		applyAction,
		deserialize,
		enhance,
		type SubmitFunction
	} from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { toast } from '@zerodevx/svelte-toast'
	import { createEventDispatcher } from 'svelte'
	import { setContext } from 'svelte-typed-context'
	import { get_current_component } from 'svelte/internal'
	import { writable } from 'svelte/store'
	import { registerForm } from './FormProvider.svelte'
	import type { ActionResult } from '@sveltejs/kit'

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

	let controller: AbortController

	// This is basically just a copy of use:enhance, but we
	// can't use that directly because we need to be able to call this
	// outside of an event, and form.requestSubmit() isn't super well supported yet:
	// https://caniuse.com/mdn-api_htmlformelement_requestsubmit
	async function submit(event?: SubmitEvent) {
		const submitter = event?.submitter as
			| HTMLButtonElement
			| HTMLInputElement
			| null
			| undefined
		if (
			submitter?.disabled || // Fix a safari bug with disabled submitters
			!dispatch('submit', event, { cancelable: true })
		)
			return

		const action = new URL(
			submitter?.hasAttribute('formaction')
				? submitter.formAction
				: // We can't do submitter.formAction directly because that property is always set
				  // We do cloneNode for avoid DOM clobbering - https://github.com/sveltejs/kit/issues/7593
				  (HTMLFormElement.prototype.cloneNode.call($el) as HTMLFormElement)
						.action
		)

		const formData = new FormData($el)

		const submitter_name = submitter?.getAttribute('name')
		if (submitter_name) {
			formData.append(submitter_name, submitter?.getAttribute('value') ?? '')
		}

		const controller = new AbortController()

		$loading = true
		let result: ActionResult
		try {
			const response = await fetch(action, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'x-sveltekit-action': 'true'
				},
				cache: 'no-store',
				body: formData,
				signal: controller.signal
			})

			result = deserialize(await response.text())
		} catch (error) {
			if ((error as any)?.name === 'AbortError') {
				$loading = false
				return
			}
			result = { type: 'error', error }
		}

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

	export const abort = () => controller?.abort()

	let idStore = writable<string>()
	$: $idStore = id

	const current = get_current_component()
	$: registerForm(id, current)

	setContext(key, {
		el,
		$on: (name, handler) => current.$on && current.$on(name, handler),
		id: idStore,
		abort,
		submit,
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
		on:submit|preventDefault={submit}
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
			{submit}
		/>
	</form>
{/if}
