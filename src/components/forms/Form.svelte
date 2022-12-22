<script lang="ts" context="module">
	import { getContext, type InjectionKey } from 'svelte-typed-context'
	import type { Writable } from 'svelte/store'
	import { getFormById } from '~/routes/layout'

	const key: InjectionKey<{
		id: Writable<string>
		loading: Writable<boolean>
		complete: Writable<boolean>
		values: Writable<Record<string, string> | null | undefined>
		invalid: Writable<Record<string, string> | null | undefined>
	}> = Symbol()

	export const getFormByIdOrContext = (id?: string) =>
		id ? getFormById(id)?.$$.context.get(key) : getContext(key)
</script>

<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'
	import { createEventDispatcher } from 'svelte'
	import { setContext } from 'svelte-typed-context'
	import { writable } from 'svelte/store'
	import { toast } from '@zerodevx/svelte-toast'
	import { get_current_component } from 'svelte/internal'
	import { registerForm } from '~/routes/layout'
	import type { ActionResult } from '@sveltejs/kit'

	export let id: string
	export let action = ''
	let cls = 'contents'
	export { cls as class }

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

	function submit({ cancel }: { cancel?: () => void } = {}) {
		if (!dispatch('submit', null, { cancelable: true }) && cancel)
			return cancel()

		$loading = true

		return async ({ result }: { result: ActionResult }) => {
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

	let idStore = writable<string>()
	$: $idStore = id

	const current = get_current_component()
	$: registerForm(id, current)

	setContext(key, {
		id: idStore,
		loading,
		complete,
		values,
		invalid
	})
</script>

{#if $$slots.complete && $complete}
	<slot name="complete" values={$values} />
{:else}
	<form {action} method="post" use:enhance={submit} class={cls} {id}>
		<!-- Keep track of which form the request came from -->
		<input type="hidden" name="$$id" value={id} />
		<slot
			loading={$loading}
			complete={$complete}
			invalid={$invalid}
			values={$values}
			{submit}
		/>
	</form>
{/if}
