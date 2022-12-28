import { SECRET_CHANGE_KEY } from '$env/static/private'
import { PUBLIC_CHANGE_KEY } from '$env/static/public'
import { json } from '@sveltejs/kit'
import { getSelf, SELF_CHANGE_ID } from '~/lib/change'
import { parseJSON } from '~/lib/fetch'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params, url }) => {
	if (params.id === SELF_CHANGE_ID) return json(getSelf(url))

	const creds = Buffer.from(
		PUBLIC_CHANGE_KEY + ':' + SECRET_CHANGE_KEY
	).toString('base64')
	const res = await fetch(
		`https://api.getchange.io/api/v1/nonprofits/${params.id}`,
		{
			headers: { Authorization: `Basic ${creds}` }
		}
	).then(parseJSON)

	return json(res, {
		headers: {
			'cache-control': 'public, max-age=3600'
		}
	})
}
