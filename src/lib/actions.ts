import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types'
import type { Session } from '@supabase/supabase-js'
import { invalid as svelteInvalid, type RequestEvent } from '@sveltejs/kit'
import type { MaybePromise } from '@sveltejs/kit/types/private'

// Page actions

export interface ClientActionEvent {
	fetch: typeof fetch
	supabaseClient: TypedSupabaseClient
	data: FormData
	session: Session | null
}
export type ClientAction = (
	event: ClientActionEvent
) => MaybePromise<Record<string, any> | void>

export const addClientActionsToServer = (
	actions: Record<string, ClientAction>
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
					fetch: event.fetch,
					data: await request.formData()
				})
			}
		])
	)

// Return the values of the form as an object, excluding the internal IDs
export const getValues = (
	data: FormData,
	{ omit = ['$$id'] }: { omit?: string[] } = {}
) => {
	const values: Record<string, string> = {}
	data.forEach((value, key) => {
		if (!omit.includes(key)) values[key] = value as string
	})
	return values
}

// These standardize output from actions, including the custom $$id field to keep
// track of which form they refer to

export const invalid = (
	status: number,
	data: FormData,
	fields: Record<string, string>
) => {
	return svelteInvalid(status, {
		id: data.get('$$id') as string,
		invalid: fields,
		values: getValues(data)
	})
}

export const success = (data: FormData) => ({
	id: data.get('$$id') as string,
	values: getValues(data)
})

// Component actions

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
