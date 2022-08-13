import type { RequestHandler } from './__types/index';

export const POST: RequestHandler = async ({ request }) => {
    const values = await request.formData();

    console.log(values.get('name'))

    return {
        location: '/request/success'
    }
};
