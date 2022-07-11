import { Context, Router, send } from './deps.ts'
import type { RouterContext, Application } from './deps.ts'
import { log } from './middleware.ts'

import {
    getUsers
} from "./users/user.controller.ts";

// deno-lint-ignore no-explicit-any
const router: any = new Router()

router.get('/ping', ({ params, response }: RouterContext<string>) => {
    response.body = 'Ping - Pong'
})

router.get("/users", (ctx: Context) => getUsers(ctx));

const init = (app: Application) => {
    app.use(router.routes())

    app.use(router.allowedMethods())
}

export default {
    init,
}
