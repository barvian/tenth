import { invalidate } from '$app/navigation'
import { page } from '$app/stores'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types'
import type { Session } from '@supabase/supabase-js'
import {
	invalid as svelteInvalid,
	type ActionResult,
	type RequestEvent
} from '@sveltejs/kit'
import {
	HttpError,
	Redirect,
	ValidationError
} from '@sveltejs/kit/runtime/control'
import type { MaybePromise } from '@sveltejs/kit/types/private'
import { get } from 'svelte/store'
import { handleError } from '~/hooks.client'
import supabaseClient from '~/lib/db'

// Page actions
// ===

export interface SharedActionEvent {
	fetch: typeof fetch
	supabaseClient: TypedSupabaseClient
	formData: FormData
	invalidate: typeof invalidate
	session: Session | null
}
export type SharedAction = (
	event: SharedActionEvent
) => MaybePromise<Record<string, any> | void>

// For reference: @sveltejs/kit/src/runtime/server/page/actions.js
export async function callAction(
	action: SharedAction,
	formData: FormData
): Promise<ActionResult> {
	try {
		const res = await action({
			fetch,
			formData,
			invalidate,
			session: get(page).data.session ?? null,
			supabaseClient
		})

		if (res instanceof ValidationError) {
			return {
				type: 'invalid',
				status: (res as any).status,
				data: (res as any).data
			}
		}

		return {
			type: 'success',
			status: 200,
			data: res ?? undefined
		}
	} catch (error) {
		if (error instanceof Redirect) {
			return {
				type: 'redirect',
				status: (error as any).status,
				location: (error as any).location
			}
		}

		return {
			type: 'error',
			error:
				error &&
				(error instanceof HttpError
					? (error as any).body
					: handleError({ error, event: get(page) }))
		}
	}
}

export const addSharedActionsToServer = (
	actions: Record<string, SharedAction>
) =>
	Object.fromEntries(
		Object.entries(actions).map(([id, action]) => [
			id,
			async (event: RequestEvent) => {
				const { request } = event
				const { session, supabaseClient } = await getSupabase(event)
				return action({
					supabaseClient,
					session,
					invalidate: async () => {
						// no-op, can't invalidate on server
					},
					fetch: event.fetch,
					formData: await request.formData()
				})
			}
		])
	)

type GetValuesOptions = { omit?: string[] }

// Return the values of the form as an object, excluding the internal IDs
export const getValues = (
	formData: FormData,
	{ omit = [] }: GetValuesOptions = {}
) => {
	const values: Record<string, string> = {}
	formData.forEach((value, key) => {
		if (key !== '$$id' && !omit.includes(key)) values[key] = value as string
	})
	return values
}

// These standardize output from actions, including the custom $$id field to keep
// track of which form they refer to

export const invalid = (
	status: number,
	formData: FormData,
	fields: Record<string, string>,
	opts?: GetValuesOptions
) => {
	return svelteInvalid(status, {
		id: formData.get('$$id') as string,
		invalid: fields,
		values: getValues(formData, opts)
	})
}

export const success = (
	formData: FormData,
	data?: any,
	opts?: GetValuesOptions
) => ({
	id: formData.get('$$id') as string,
	values: getValues(formData, opts),
	data
})

// Component actions
// ===

export function clickOutside(node: HTMLElement) {
	function handleClick(event: Event) {
		if (!node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'))
		}
	}

	document.addEventListener('click', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true)
		}
	}
}

export function escape(node: HTMLElement) {
	function handleWindowKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') node.dispatchEvent(new CustomEvent('escape'))
	}

	window.addEventListener('keydown', handleWindowKeyDown, true)

	return {
		destroy() {
			window.removeEventListener('keydown', handleWindowKeyDown, true)
		}
	}
}
