import { compile } from 'mdsvex'
import faqs from '~/data/faqs.yml'
import type { RequestHandler } from './__types/faqs.json';

export const GET: RequestHandler<Record<string, string>[]> = async ({ params }) => ({
    body: await Promise.all(faqs.map(async ({ q, a }) => ({
        q, a: (await compile(a)).code
    })))
})
