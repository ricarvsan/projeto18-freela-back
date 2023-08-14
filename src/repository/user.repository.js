import { db } from '../database/database.connection.js';

export async function findUser(email) {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result;
}

export async function deletePreviousSessions(id) {
    await db.query(`DELETE FROM session WHERE "userId" = $1`, [id])
}

export async function insertNewSession(id, token) {
    await db.query(`INSERT INTO session ("userId", token) VALUES ($1, $2)`, [id, token])
}

export async function insertNewUser(name, email, hash, cpf, phonenumber) {
    await db.query(`
            INSERT INTO users (name, email, password, cpf, phonenumber)
            VALUES ($1, $2, $3, $4, $5);
        `, [name, email, hash, cpf, phonenumber]
    );
}