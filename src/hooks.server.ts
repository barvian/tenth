import { dev } from '$app/environment'
import type { HandleServerError } from '@sveltejs/kit'
import '~/../mocks/server'
import '~/lib/db'

export const handleError: HandleServerError = ({ error, event }) => {
	if (dev) {
		console.error(error, event)
	} else {
		// Sentry.captureException(error, { event });
	}

	return {
		message:
			(error as any)?.display_message ??
			'Something went wrong. Please try again later.'
	}
}
