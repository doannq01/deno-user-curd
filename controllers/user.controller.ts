import dayjs from "https://cdn.skypack.dev/dayjs@1.10.7";
import { validate, required } from "https://deno.land/x/validasaur/mod.ts";
import UserService from "../services/user.services.ts"
import { log } from '../middleware.ts'

export async function getUsers(ctx: Context) {
    const count: number = await UserService.getCount()
    const offset: number = parseInt(ctx.request.url.searchParams.get('offset') as any) || 0;
    const limit: number = parseInt(ctx.request.url.searchParams.get('limit') as any) || 10;
    const pages = Math.ceil(count / limit)
    const pagination = {
        total_user: count,
        total_pages: pages,
        offset: offset,
        limit: limit
    }
    const userMappings = await UserService.getUsers(offset, limit)

    log.debug("===== GetUsers ======", JSON.stringify({ offset, limit }))

    ctx.response.status = 200
    ctx.response.body = { pagination, data: userMappings }
}

export async function createUser(ctx: Context) {
    const body = await ctx.request.body() as any;
    const { first_name, last_name, birth_day, email } = await body.value;

    try {
        let [passes, errors] = await validate({ first_name, last_name, birth_day, email }, {
            first_name: required,
            last_name: required,
            birth_day: required,
            email: required
        });

        const birth_day_require = new Date(dayjs().subtract(18, 'year')).getTime()

        const birth_day_unix = new Date(birth_day).getTime()

        if (birth_day_unix > birth_day_require) {
            passes = false;
            errors = { ...errors, age: { valid: 'The user should be at least 18 years old' } }
        }

        const checkEmailExist = await UserService.getByEmail(email)

        if (checkEmailExist > 0) {
            passes = false;
            errors = { ...errors, age: { valid: 'Email already exists' } }
        }

        if (!passes) {
            ctx.response.body = {
                "name": "ValidationError",
                "message": "Parameters validation error!",
                "code": 422,
                "type": "VALIDATION_ERROR",
                errors
            }
            log.error("===== CreateUser ======", JSON.stringify({ errors }))
            ctx.response.status = 422
            return
        }

        const newRecord = await UserService.createUser(first_name, last_name, birth_day, birth_day_unix, email)

        ctx.response.body = newRecord
        log.debug("===== CreateUser ======", JSON.stringify({ first_name, last_name, birth_day, email }))

    } catch (err) {
        log.error("===== CreateUser ======", JSON.stringify({ err }))
        ctx.response.status = 500
        ctx.response.body = { error: err }
    }
}