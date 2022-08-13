import data from './data/charities.json'
import { rest } from 'msw'
import type { Nonprofit } from '../types/change';
import {isConnectedToTheInternet} from './utils'

export default [
    rest.get(
        'https://api.getchange.io/api/v1/nonprofits/:id',
        async (req, res, ctx) => {
          if (await isConnectedToTheInternet()) return

          return res(ctx.json(data.find(c => c.id === req.params.id)))
        },
      )
]