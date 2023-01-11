import { dev } from '$app/environment'
import { INNGEST_SIGNING_KEY } from '$env/static/private'
import { InngestCommHandler } from 'inngest'
import { queryKeys } from 'inngest/helpers/consts'
import type { RequestHandler } from './$types'
import fns from '/inngest'

const env = { INNGEST_SIGNING_KEY }
const isProduction = !dev

const serve: RequestHandler = async ({ fetch, url, request }) => {
	const handler = new InngestCommHandler(
		'sveltekit',
		'Web App',
		fns,
		{ fetch },
		() => ({
			register() {
				if (request.method === 'PUT') {
					return {
						env,
						isProduction,
						url,
						deployId: url.searchParams.get(queryKeys.DeployId)
					}
				}
			},
			async run() {
				if (request.method === 'POST') {
					return {
						data: (await request.json()) as Record<string, any>,
						env,
						fnId: url.searchParams.get(queryKeys.FnId) as string,
						isProduction,
						url
					}
				}
			},
			view() {
				if (request.method === 'GET') {
					return {
						env,
						isIntrospection: url.searchParams.has(queryKeys.Introspect),
						isProduction,
						url
					}
				}
			}
		}),
		({ body, status, headers }) =>
			new Response(body, {
				status,
				headers
			})
	)

	return handler.createHandler()()
}

export { serve as GET }
export { serve as PUT }
export { serve as POST }
