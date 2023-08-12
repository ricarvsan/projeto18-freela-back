import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db } from '../database/database.connection.js';

export async function signup(req, res) {
    const { name, email, password, cpf, phonenumber } = req.body;

    try {
        //const emailInUse = await db.collection('users').findOne({email});
        const emailInUse = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (emailInUse.rowCount) return res.status(409).send({ message: 'Já existe um usuário com este email cadastrado!' })


        const hash = bcrypt.hashSync(password, 10)
        //await db.collection('users').insertOne({name, email, password: hash})
        await db.query(`
            INSERT INTO users (name, email, password, cpf, phonenumber)
            VALUES ($1, $2, $3, $4, $5);
        `, [name, email, hash, cpf, phonenumber]);

        res.status(201).send('Usuário criado com sucesso!')
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signin(req, res) {
    const { email, password } = req.body;

    try {
        //const user = await db.collection('users').findOne({email});
        const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (!(user.rowCount)) return res.status(401).send({ message: 'Usuário não encontrado!' });

        const correctPassword = bcrypt.compareSync(password, user.rows[0].password);
        if (!correctPassword) return res.status(401).send({ message: 'Senha incorreta!' });

        const token = uuid();

        //await db.collection('session').deleteMany({userId: user._id});
        await db.query(`DELETE FROM session WHERE "userId" = $1`, [user.rows[0].id])

        //await db.collection('session').insertOne({token, userId: user._id});
        await db.query(`INSERT INTO session ("userId", token) VALUES ($1, $2)`, [user.rows[0].id, token])

        res.status(200).send({ token })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function aboutMe(req, res) {
    try {
        const me = await db.query(`
            SELECT users.id AS id, users.name AS name, SUM(visitants) AS "visitCount" FROM session
            JOIN users ON session."userId" = users.id
            JOIN "middleUrls" ON users.id = "middleUrls"."userId"
            JOIN urls ON "middleUrls"."urlsId" = urls.id
            WHERE users.id = $1
            GROUP BY users.id;
        `, [res.locals.session.rows[0].userId]);

        const urls = await db.query(`
            SELECT urls.id, urls."shortUrl", urls.url, urls.visitants AS "visitCount" FROM "middleUrls"
            JOIN urls ON "middleUrls"."urlsId" = urls.id
            WHERE "middleUrls"."userId" = $1;
        `, [res.locals.session.rows[0].userId]);

        res.status(200).send({...me.rows[0], shortenedUrls: urls.rows})

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function ranking(req, res) {
    try {
        const ranking = await db.query(`
            SELECT users.id AS id, users.name AS name, COUNT("middleUrls"."userId") AS "linksCount", SUM(visitants) AS "visitCount" FROM session
            JOIN users ON session."userId" = users.id
            JOIN "middleUrls" ON users.id = "middleUrls"."userId"
            JOIN urls ON "middleUrls"."urlsId" = urls.id
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10;
        `);

        res.status(200).send(ranking.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}