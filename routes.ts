
import { Context, Router, send } from './deps.ts'
import type { RouterContext, Application } from './deps.ts'
import authMiddleware from './auth-middleware.ts'

import {
    getUsers,
    createUser
} from "./controllers/user.controller.ts";

import {
    login
} from "./controllers/auth.controller.ts";

// deno-lint-ignore no-explicit-any
const router: any = new Router()

router.get('/ping', ({ params, response }: RouterContext<string>) => {
    response.body = 'Ping - Pong'
})

router.post("/login", (ctx: Context) => login(ctx));

router.get("/users", authMiddleware, (ctx: Context) => getUsers(ctx));
router.post("/user", authMiddleware, (ctx: Context) => createUser(ctx));

const init = (app: Application) => {
    app.use(router.routes())

    app.use(router.allowedMethods())
}

export default {
    init,
}
