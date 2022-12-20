import type { HandleServerError } from '@sveltejs/kit'
import '~/../mocks/server'
import '~/lib/db'

export const handleError: HandleServerError = ({ error, event }) => {
	return {
		message:
			// @ts-ignore
			error?.display_message ?? 'Something went wrong. Please try again later.'
	}
}
