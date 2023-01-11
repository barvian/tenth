import { PLEDGE_KEY } from '$env/static/private'
import { json } from '@sveltejs/kit'
import { parseJSON } from '~/lib/fetch'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	const res = await fetch(
		`https://api.pledge.to/v1/organizations/${params.id}`,
		{
			headers: { Authorization: `Bearer ${PLEDGE_KEY}` }
		}
	).then(parseJSON)

	return json(res, {
		headers: {
			'cache-control': 'public, max-age=3600'
		}
	})
}
