import { error, json } from '@sveltejs/kit';

import { sign, verify } from "jsonwebtoken";
import { JWT_ACCESSTOKEN, JWT_REFRESHTOKEN } from "$env/static/private";

export async function POST({ request, cookies, setHeaders }) {
    try {

        const { username, pwd } = await request.json();

        if (username == pwd) {
            let userdata = {
                username, secret: crypto.randomUUID(),
            }
            const accesstoken = sign(userdata, JWT_ACCESSTOKEN, { expiresIn: '1h' });
            const refreshtoken = sign(userdata, JWT_REFRESHTOKEN);
            setHeaders({ ci_session: `CI_SESSION=PHP_STREAM` });
            setHeaders({ refresh_token: refreshtoken });

            cookies.set('authorization', refreshtoken, {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                maxAge: 60 * 60 * 24,
            })

            return json({ accesstoken })
        } else {
            throw new Error('api', { cause: "Invalid data" });
        }


    } catch (e) {
        console.log(e);
        throw error(400, { error: true, msg: e?.cause ?? e });;
    }
}