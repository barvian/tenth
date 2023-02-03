import { rest } from 'msw'
import type {
	Organization,
	OrganizationRequestResponse,
	OrganizationSearchResults
} from '~/lib/pledge'
import data from './fixtures/organizations.json'

export default [
	rest.get(
		'https://api.pledge.to/v1/organizations/:id',
		async (req, res, ctx) => {
			const c = data.find((c) => c.id === req.params.id)
			if (!c) return req.passthrough()
			return res(ctx.json(c))
		}
	),
	rest.get('https://api.pledge.to/v1/organizations', async (req, res, ctx) => {
		return res(
			ctx.json<OrganizationSearchResults>({
				page: 1,
				per: 25,
				total_count: data.length,
				results: data as Organization[]
			})
		)
	}),
	rest.post('https://api.pledge.to/v1/organizations', async (req, res, ctx) => {
		const { ngo_id } = await req.json()
		if (ngo_id.length < 9) {
			return res(
				ctx.json({
					message: ['Please enter a valid EIN'],
					error_codes: ['ngo_id_invalid']
				} as OrganizationRequestResponse)
			)
		}
		return res(ctx.json({} as OrganizationRequestResponse))
	})
]
