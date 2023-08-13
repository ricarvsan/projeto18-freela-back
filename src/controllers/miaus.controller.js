import { db } from '../database/database.connection.js';

export async function getMiaus(req, res) {

    try {
        const miaus = await db.query(`SELECT * FROM miau;`);

        const miaudelos = miaus.rows.map(miau => ({id: miau.id, name: miau.name, url: miau.mainPhoto}));

        res.status(201).send(miaudelos);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getMiauById(req, res) {
    const { id } = req.params;

    try {
        const miau = await db.query(`
            SELECT miau.id, miau.name, miau."mainPhoto" AS url, miau.about, users.name AS tutor, users.phonenumber FROM miau
            JOIN users ON miau."userId" = users.id WHERE miau.id = $1`, [id]
        )
        if(!(miau.rows)) return res.status(404).send({message: 'Miaudelo não encontrado!'});
        
        res.status(201).send(miau.rows[0]);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function insertMiau(req, res) {
    const {name, mainPhoto, about} = req.body;

    try {
        const miau = await db.query(`SELECT * FROM miau WHERE id = $1;`, [id])
        if(!(miau.rows)) return res.status(404).send({message: 'Miaudelo não encontrado!'});
        res.status(201).send(miau.rows[0])
    } catch (err) {
        res.status(500).send(err.message)
    }
}

