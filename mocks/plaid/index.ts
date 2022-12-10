import { rest } from 'msw'
import stripeTokenResponse from './data/stripeTokenResponse.json'

export default [
  rest.post(
    'https://sandbox.plaid.com/processor/stripe/bank_account_token/create',
    async (req, res, ctx) =>
      res(ctx.json(stripeTokenResponse))
  )
]