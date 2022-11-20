import { rest } from 'msw'
import data from './data/charities.json'

export default [
  rest.get(
    'https://api.getchange.io/api/v1/nonprofits/:id',
    async (req, res, ctx) =>
      res(ctx.json(data.find(c => c.id === req.params.id)))
  )
]