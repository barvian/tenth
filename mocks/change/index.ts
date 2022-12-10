import { rest } from 'msw'
import data from './data/charities.json'
import account from './data/account.json'
import request from './data/request.json'

export default [
  rest.get(
    'https://api.getchange.io/api/v1/nonprofits/:id',
    async (req, res, ctx) =>
      res(ctx.json(data.find(c => c.id === req.params.id)))
  ),
  rest.post(
    'https://api.getchange.io/api/v1/accounts',
    async (req, res, ctx) =>
      res(ctx.json(account))
  ),
  rest.post(
    'https://api.getchange.io/api/v1/accounts/attach_bank_account',
    async (req, res, ctx) =>
      res(ctx.json({ ...account, active: true }))
  ),
  rest.post(
    'https://api.getchange.io/api/v1/nonprofit_requests',
    async (req, res, ctx) =>
      res(ctx.json(request))
  )
]