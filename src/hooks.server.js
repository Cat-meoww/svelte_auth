import { verify } from "jsonwebtoken";
import { JWT_ACCESSTOKEN, JWT_REFRESHTOKEN } from "$env/static/private";

export const handle = async ({ event, resolve }) => {
    try {
        if (event.url.pathname.startsWith('/api/auth')) {
            return resolve(event);
        } else if (event.url.pathname.startsWith('/auth')) {
            return resolve(event);
        } else {
            const authheader = event.request.headers.get('authorization')
            const Token = authheader && authheader.split(' ')[1]
            if (typeof Token == 'undefined' || Token == null) {
                throw new Error('hook', { cause: "Token empty" });
            }
            let access = await new Promise((resolve, reject) => {
                verify(Token, JWT_ACCESSTOKEN, (err, data) => {
                    if (err) return reject("Token error");
                    return resolve(data);
                });
            })
            if (!access) throw new Error('hook', { cause: 'invaild token' });
            //console.log(access);
            event.locals.userdata = access
            return resolve(event);


        }
    } catch (e) {
        //console.log(e);
        return new Response('❤️');

    }



}