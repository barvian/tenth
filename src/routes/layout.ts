// Circular references necessitate another file here

import { getContext, type InjectionKey } from 'svelte-typed-context'
import type Form from '~/components/forms/Form.svelte'

export const key: InjectionKey<{
	registerForm: (id: string, form: Form) => Form
	getFormById: (id?: string) => Form | undefined
}> = Symbol()

export const registerForm = (id: string, form: Form) =>
	getContext(key)?.registerForm(id, form)
export const getFormById = (id?: string) => getContext(key)?.getFormById(id)
