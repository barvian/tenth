import { dev } from '$app/environment'
import * as Sentry from '@sentry/node'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { HandleServerError } from '@sveltejs/kit'
import '~/lib/db'
import { mockRequests } from '~/mocks/server'

if (dev) mockRequests()
else {
	Sentry.init({
		dsn: 'https://a86a93f598414db9ace55da039f9ed03@o4504442247380992.ingest.sentry.io/4504442255114240'
	})
}

export const handleError: HandleServerError = ({ error, event }) => {
	if (dev) {
		console.error(error)
	} else {
		getSupabase(event).then(({ session }) => {
			Sentry.captureException(error, {
				user: session?.user,
				extra: { event }
			})
		})
	}

	return {
		message:
			(error as any)?.display_message ??
			'Something went wrong. Please try again later.'
	}
}
