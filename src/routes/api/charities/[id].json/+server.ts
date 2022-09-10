import type { Nonprofit } from 'types/change';
import type { RequestHandler } from './$types';
import { PUBLIC_CHANGE_KEY } from '$env/static/public';
import { SECRET_CHANGE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	const creds = Buffer.from(PUBLIC_CHANGE_KEY+':'+SECRET_CHANGE_KEY).toString('base64')
	const res = await fetch(`https://api.getchange.io/api/v1/nonprofits/${params.id}`, {
		headers: { 'Authorization': `Basic ${creds}`}
	})

	return json(await res.json(), {
		headers: {
			'cache-control': 'public, max-age=3600'
		}
	});
}
