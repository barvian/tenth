import { compile } from 'mdsvex'
import faqs from '~/data/faqs.yml'
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit'

export const GET: RequestHandler = async () =>
    json(await Promise.all(faqs.map(async ({ q, a }: { q: string, a: string }) => ({
        q, a: (await compile(a))!.code
    }))))
