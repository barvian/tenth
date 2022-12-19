import type { HandleClientError } from '@sveltejs/kit'
import '~/lib/db'
// import '~/../mocks/browser';

export const handleError: HandleClientError = ({ error, event }) => {
	return {
		message:
			// @ts-ignore
			error?.display_message ?? 'Something went wrong. Please try again later.'
	}
}
