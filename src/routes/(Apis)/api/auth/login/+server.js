import { error, json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
    try {

        const { username, pwd } = await request.json();
        return json(request);

    } catch (error) {
        throw error(400, { error: true, msg: e });;
    }
}