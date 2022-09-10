import type { PageLoad } from './$types';

export const prerender = true

const POPULAR_CHARITIES = [
    'n_ZIAe7Rdt9y8QmGSyRC1qZT3n',
    'n_IfEoPCaPqVsFAUI5xl0CBUOx',
    'n_RicJNF99vJAI4YTTJqtAREpg',
    'n_MUjmT5yhdf4smx1ykRwO2ovt',
    'n_UO3DO3yxvkJpu63elPPvKGcg'
]

export const load: PageLoad = async ({ fetch }) => ({
    popular: await Promise.all(POPULAR_CHARITIES.map(id =>
        fetch(`/api/charities/${id}.json`).then(res => res.json())
    )),
    faqs: await fetch('/api/faqs.json').then(res => res.json())
})
