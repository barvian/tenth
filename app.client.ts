import { dev } from '$app/environment'
import { page } from '$app/stores'
// Haven't needed to do this yet:
// import { mockRequests } from '~/mocks/browser'
import * as Sentry from '@sentry/browser'
import type { HandleClientError } from '@sveltejs/kit'
import { get } from 'svelte/store'
import '~/lib/db'

if (!dev) {
	Sentry.init({
		dsn: 'https://8e0ebee7a3ef44a6af1745d490cac1bf@o4504442247380992.ingest.sentry.io/4504442252230657'
	})
}

export const handleError: HandleClientError = ({ error, event }) => {
	if (dev) {
		console.error(error, event)
	} else {
		Sentry.captureException(error, {
			user: get(page).data.session?.user,
			extra: { event }
		})
	}

	return {
		message:
			(error as any)?.display_message ??
			'Something went wrong. Please try again later.'
	}
}
