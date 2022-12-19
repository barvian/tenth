import type { HandleServerError } from '@sveltejs/kit'
import '~/lib/db'
import '~/../mocks/server'

export const handleError: HandleServerError = ({ error, event }) => {
	return {
		message:
			// @ts-ignore
			error?.display_message ?? 'Something went wrong. Please try again later.'
	}
}
