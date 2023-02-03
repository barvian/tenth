import env from '$env'
import { json } from '@sveltejs/kit'
import { parseJSON } from '~/lib/fetch'
import type { RequestHandler } from './[id].json/$types'

export const GET = (async ({ params }) => {
	const res = await fetch(
		`https://api.pledge.to/v1/organizations/${params.id}`,
		{
			headers: { Authorization: `Bearer ${env.PLEDGE_KEY}` }
		}
	).then(parseJSON)

	return json(res, {
		headers: {
			'cache-control': 'public, max-age=3600'
		}
	})
}) satisfies RequestHandler
