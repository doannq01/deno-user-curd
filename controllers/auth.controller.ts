import { makeJwt, setExpiration, Jose, Payload } from 'https://deno.land/x/djwt@v1.2/create.ts';

const header: Jose = {
    alg: 'HS256',
    typ: 'JWT',
};
const key = `111111`

export async function login(ctx: Context) {
    const { value } = ctx.request.body();
    const datas = await value;
    if (datas.username === 'username' && datas.password === 'password') {
        const payload: Payload = {
            iss: datas.username,
            exp: setExpiration(new Date().getTime() + 60000),
        };
        const jwt = await makeJwt({ key, header, payload });
        if (jwt) {
            ctx.response.status = 200;
            ctx.response.body = {
                username: datas.username,
                token: jwt
            }
        } else {
            ctx.response.status = 500;
            ctx.response.body = {
                message: 'Internal server error'
            }
        }
        return;
    }
    ctx.response.status = 422;
    ctx.response.body = {
        message: 'Invalid username or password'
    }
}
