import { Context } from 'https://deno.land/x/oak/mod.ts';
import { validateJwt } from "https://deno.land/x/djwt@v1.7/validate.ts";

const key = `111111`

const authMiddleware = async (ctx: Context, next: any) => {
    const headers: Headers = ctx.request.headers;
    const authorization = headers.get('Authorization')
    if (!authorization) {
        ctx.response.status = 401;
        return;
    }
    const jwt = authorization.split(' ')[1];
    if (!jwt) {
        ctx.response.status = 401;
        return;
    }
    if (await validateJwt({ jwt, key, algorithm: "HS256" })) {
        await next()
        return;
    }
    ctx.response.status = 401;
    ctx.response.body = { message: 'Invalid jwt token' }
};

export default authMiddleware;