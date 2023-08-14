import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {deletePreviousSessions, findUser, insertNewSession, insertNewUser} from '../repository/user.repository.js';

export async function signup(req, res) {
    const { name, email, password, cpf, phonenumber } = req.body;

    try {
        //const emailInUse = await db.collection('users').findOne({email});
        const emailInUse = await findUser(email);
        if (emailInUse.rowCount) return res.status(409).send({ message: 'Já existe um usuário com este email cadastrado!' })


        const hash = bcrypt.hashSync(password, 10);

        insertNewUser(name, email, hash, cpf, phonenumber);

        res.status(201).send('Usuário criado com sucesso!')
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signin(req, res) {
    const { email, password } = req.body;

    try {
        //const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = await findUser(email);
        if (!(user.rowCount)) return res.status(401).send({ message: 'Usuário não encontrado!' });

        const correctPassword = bcrypt.compareSync(password, user.rows[0].password);
        if (!correctPassword) return res.status(401).send({ message: 'Senha incorreta!' });

        const token = uuid();

        deletePreviousSessions(user.rows[0].id);

        insertNewSession(user.rows[0].id, token);


        res.status(200).send({ token, id: user.rows[0].id })
    } catch (err) {
        res.status(500).send(err.message)
    }
}