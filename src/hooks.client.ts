import { dev } from '$app/environment'
import type { HandleClientError } from '@sveltejs/kit'
import '~/lib/db'
// import '~/../mocks/browser';

export const handleError: HandleClientError = ({ error, event }) => {
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
