<!-- Lets forms register themselves within by ID -->
<script lang="ts" context="module">
	import { getContext, type InjectionKey } from 'svelte-typed-context'
	import type Form from '~/components/forms/Form.svelte'

	export const key: InjectionKey<{
		registerForm: (id: string, form: Form) => Form
		getFormById: (id?: string) => Form | undefined
	}> = Symbol()

	export const registerForm = (id: string, form: Form) =>
		getContext(key)?.registerForm(id, form)
	export const getFormById = (id?: string) => getContext(key)?.getFormById(id)
</script>

<script lang="ts">
	import { setContext } from 'svelte-typed-context'

	const forms: Record<string, Form> = {}
	setContext(key, {
		registerForm: (id: string, form: Form) => (forms[id] = form),
		getFormById: (id?: string) => id && forms[id]
	})
</script>

<slot />
