import dayjs from "https://cdn.skypack.dev/dayjs@1.10.7";
import { db } from "../database.ts";
import { User, Image, Attribute } from "../models/index.ts";

const getCount = async () => {
    const [count]: number[] = db.query(`SELECT COUNT(id) FROM user`)[0];
    return count
}

const getByEmail = async (email: string) => {
    const [count]: number[] = db.query(`SELECT COUNT(id) FROM user where email = ?`, [email])[0];
    return count
}

const getUsers = async (offset: number, limit: number) => {
    try {
        let userMappings = [];
        const query = `SELECT * FROM user  ORDER BY id desc LIMIT ${limit} OFFSET ${offset};`
        const users: User[] = [...db.query(query)];
        const userIds = [];
        for (const [id, first_name, last_name, birth_day, email] of users) {
            userMappings.push({ id, first_name, last_name, birth_day: dayjs(birth_day), email });
            userIds.push(id)
        }

        const medias: Image[] = [...db.query(`SELECT * FROM image where user_id in (${userIds.toString()}) ORDER BY created desc`)].map(([id, name, created, height, width, user_id]) => {
            return { id, name, created, height, width, user_id }
        })

        const attributes: Attribute[] =
            [...db.query(`SELECT A.name as name, AU.user_id FROM attribute as A
                        LEFT OUTER JOIN attribute_user as AU
                        ON AU.attribute_id = A.id`)].map(([name, user_id]) => {
                return { name, user_id }
            })

        userMappings = userMappings.map(({ id, first_name, last_name, birth_day, email }) => {
            return { id, first_name, last_name, birth_day, email, medias: medias.filter((r) => r.user_id === id), attributes: attributes.filter((r) => r.user_id === id) }
        })
        return userMappings
    } catch (error) {
        throw new Error(error);
    }
}

const createUser = async (first_name, last_name, birth_day, birth_day_unix, email) => {
    try {
        await db.query("INSERT INTO user (first_name, last_name, birthday, email) VALUES (?, ?, ?, ?)", [
            first_name, last_name, birth_day_unix, email
        ]);
        return { first_name, last_name, birth_day, email }
    } catch (error) {
        throw new Error(error);
    }
}


export default {
    getCount, getUsers, createUser, getByEmail
}