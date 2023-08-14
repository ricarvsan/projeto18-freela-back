import { db } from '../database/database.connection.js';

export async function getAllMiaus() {
    const result = await db.query(`SELECT * FROM miau ORDER BY "createdAt";`);
    return result;
}

export async function getMiauByIdDb(id) {
    const result = await db.query(`
            SELECT miau.id, miau.name, miau."mainPhoto" AS url, miau.about, miau.active, users.id as "userId", users.name AS tutor, users.phonenumber FROM miau
            JOIN users ON miau."userId" = users.id WHERE miau.id = $1`, [id]
        )
    return result;
}

export async function insertMiauDb(name, mainPhoto, userId, about) {
    await db.query(`
            INSERT INTO miau (name, "mainPhoto", "userId", about)
            VALUES ($1, $2, $3, $4)
        `, [name, mainPhoto, userId, about]);
}

export async function updateMiauStatus(active, id) {
    await db.query(`
            UPDATE miau SET active = $1 WHERE id = $2;
        `, [active, id]);
}