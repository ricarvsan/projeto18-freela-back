import { db } from '../database/database.connection.js';
import { getAllMiaus, getMiauByIdDb, insertMiauDb, updateMiauStatus } from '../repository/miaus.repository.js';

export async function getMiaus(req, res) {

    try {
        const miaus = await getAllMiaus();

        const miaudelos = miaus.rows.map(miau => {
            if(miau.active || res.locals.session.rows[0].userId === miau.userId) {
                return {id: miau.id, name: miau.name, url: miau.mainPhoto}
            } 
        }
        );

        res.status(201).send(miaudelos);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getMiauById(req, res) {
    const { id } = req.params;

    try {
        const miau = await getMiauByIdDb(id);
        if(!(miau.rows)) return res.status(404).send({message: 'Miaudelo não encontrado!'});
        
        res.status(201).send(miau.rows[0]);
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function insertMiau(req, res) {
    const {name, mainPhoto, about} = req.body;
    //res.locals.session.rows[0].userId

    try {
        insertMiauDb(name, mainPhoto, res.locals.session.rows[0].userId, about);

        res.status(201).send({message: 'Miau cadastrado!'})
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function updateStatus(req, res) {
    const { id } = req.params;
    let {active} = req.body;
    //res.locals.session.rows[0].userId

    if(active) {
        active = false;
    } else {
        active = true;
    }

    try {
        updateMiauStatus(active, id);

        const miau = await getMiauByIdDb(id);

        res.status(201).send(miau.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}