import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import plaidClient from '~/lib/plaid'
import { CountryCode } from 'plaid'

export const GET: RequestHandler = async ({ params }) => {
	const res = await plaidClient.institutionsGetById({
		institution_id: params.id,
		country_codes: [CountryCode.Us],
		options: {
			include_optional_metadata: true
		}
	})

	return json(res.data.institution, {
		headers: {
			'cache-control': 'public, max-age=3600'
		}
	})
}
