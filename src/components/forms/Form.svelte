<script lang="ts" context="module">
	import { getContext, type InjectionKey } from 'svelte-typed-context'
	import type { Writable } from 'svelte/store'

	const key: InjectionKey<{
		hasUniqueId: Writable<boolean>
		loading: Writable<boolean>
		complete: Writable<boolean>
		values: Writable<Record<string, string>>
		invalid: Writable<Record<string, string>>
	}> = Symbol()

	export const getForm = () => getContext(key)
</script>

<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { createEventDispatcher, onMount } from 'svelte'
	import { setContext } from 'svelte-typed-context'
	import { writable } from 'svelte/store'
	import { toast } from '@zerodevx/svelte-toast'

	export let action = ''
	export let id = action
	let cls = 'contents'
	export { cls as class }

	let form: HTMLFormElement

	const dispatch = createEventDispatcher()

	let loading = writable(false)
	let complete = writable(false)
	let values = writable<Record<string, string> | null | undefined>()
	let invalid = writable<Record<string, string> | null | undefined>()

	const handlePageUpdates = () => {
		$complete =
			$page.status === 200 && $page.form?.id != null && $page.form?.id == id
		if ($page.form?.id != null && $page.form?.id == id) {
			$values = $page.form?.values
			$invalid = $page.form?.invalid
		}
	}
	$: $page, handlePageUpdates()

	const handleSubmit: SubmitFunction = ({ action, cancel }) => {
		if (!dispatch('submit', null, { cancelable: true })) return cancel()

		$loading = true

		return async ({ result }) => {
			if (
				result.type === 'success' &&
				dispatch('load', result, { cancelable: true })
			) {
				await invalidateAll()
			}

			const apply = dispatch('loadend', result)

			// On the client, let's skip the error boundary and just show a toast
			if (result.type === 'error') {
				toast.push(result.error.message, { classes: ['error'] })
			} else if (apply) {
				await applyAction(result)
			}

			if (result.type === 'success') dispatch('complete', result)
			$loading = false
		}
	}

	let hasUniqueId = writable<boolean>()
	$: $hasUniqueId = id !== action

	setContext(key, {
		hasUniqueId,
		loading,
		complete,
		values,
		invalid
	})
</script>

{#if $$slots.complete && $complete}
	<slot name="complete" values={$values} />
{:else}
	<form
		{action}
		method="post"
		use:enhance={handleSubmit}
		bind:this={form}
		class={cls}
		id={$hasUniqueId ? id : null}
	>
		<!-- Keep track of which form the request came from -->
		<input type="hidden" name="$$id" value={id} />
		<slot
			loading={$loading}
			complete={$complete}
			invalid={$invalid}
			values={$values}
			submit={() => form?.requestSubmit()}
		/>
	</form>
{/if}
