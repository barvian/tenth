import type { Nonprofit } from 'types/change';
import type { RequestHandler } from './__types/[id].json';
import { PUBLIC_CHANGE_KEY } from '$env/static/public';
import { SECRET_CHANGE_KEY } from '$env/static/private';

export const GET: RequestHandler<Nonprofit> = async ({ params }) => {
	const creds = Buffer.from(PUBLIC_CHANGE_KEY+':'+SECRET_CHANGE_KEY).toString('base64')
	const res = await fetch(`https://api.getchange.io/api/v1/nonprofits/${params.id}`, {
		headers: { 'Authorization': `Basic ${creds}`}
	})

	return {
		headers: {
			'cache-control': 'public, max-age=3600'
		},
		body: await res.json()
	};
}
