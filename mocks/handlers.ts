import { rest } from 'msw'
import data from './data/charities.json'
import { type Nonprofit } from '../lib/change'

export const handlers = [
    rest.get(
        'https://api.getchange.io/api/v1/nonprofits/:id',
        async (req, res, ctx) => {
          return res(ctx.json<Nonprofit>(data.find(c => c.id === req.params.id)!))
        },
      )
]