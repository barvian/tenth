import { rest } from 'msw'
import institutions from './data/institutions.json'
import stripeTokenResponse from './data/stripeTokenResponse.json'

export default [
	rest.post(
		'https://sandbox.plaid.com/institutions/get_by_id',
		async (req, res, ctx) => {
			const { institution_id } = await req.json()
			const institution = institutions.find(
				(i) => i.institution_id === institution_id
			)
			if (!institution) return req.passthrough()
			return res(ctx.json({ institution, request_id: 'fake-id' }))
		}
	),
	rest.post(
		'https://sandbox.plaid.com/processor/stripe/bank_account_token/create',
		async (req, res, ctx) => res(ctx.json(stripeTokenResponse))
	)
]
