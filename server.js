import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let db;

async function startDatabase() {
    db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

    await db.run(`
        CREATE TABLE IF NOT EXISTS PRODUTOS (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            PRODUTO TEXT,
            PRECO FLOAT,
            QUANTIDADE INTEGER,
            DESCRICAO TEXT
        )
    `);
}

app.get('/produtos', async (req, res) => {
    const produtos = await db.all('SELECT * FROM PRODUTOS');
    res.json(produtos);
});

app.post('/produtos', async (req, res) => {
    const { produto, preco, quantidade, descricao } = req.body;
    await db.run(
        `INSERT INTO PRODUTOS (PRODUTO, PRECO, QUANTIDADE, DESCRICAO) VALUES (?, ?, ?, ?)`,
        [produto, preco, quantidade, descricao]
    );
    res.json({ mensagem: 'Produto inserido!' });
});

app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { produto, preco, quantidade, descricao } = req.body;
    await db.run(
        `UPDATE PRODUTOS SET PRODUTO = ?, PRECO = ?, QUANTIDADE = ?, DESCRICAO = ? WHERE ID = ?`,
        [produto, preco, quantidade, descricao, id]
    );
    res.json({ mensagem: 'Produto atualizado!' });
});

app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    await db.run(`DELETE FROM PRODUTOS WHERE ID = ?`, [id]);
    res.json({ mensagem: 'Produto deletado!' });
});

startDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
});
