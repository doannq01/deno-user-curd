import dayjs from "https://cdn.skypack.dev/dayjs@1.10.7";
import { User } from "./users.model.ts";
import { db } from "../DB.ts";

export function getUsers(ctx: Context) {
    const [count]: number[] = db.query(`SELECT COUNT(id) FROM user`)[0];
    const userMappings = [];

    const offset: number = parseInt(ctx.request.url.searchParams.get('offset') as any) || 0;
    const limit: number = parseInt(ctx.request.url.searchParams.get('limit') as any) || 10;
    const pages = Math.ceil(count / limit)
    const pagination = {
        total_user: count,
        total_pages: pages,
        offset: offset,
        limit: limit
    }


    const users: User[] = [...db.query(`SELECT * FROM user LIMIT ${limit} OFFSET ${offset};`)];

    for (const [id, first_name, last_name, birth_day, email] of users) {
        userMappings.push({ id, first_name, last_name, birth_day: dayjs(birth_day), email });
    }
    ctx.response.status = 200
    ctx.response.body = { pagination, data: userMappings }
}