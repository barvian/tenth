import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals }) => ({
    session: {
        user: locals.user,
        accessToken: locals.accessToken
    }
})