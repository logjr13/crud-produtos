import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Para funcionar corretamente com "import" e "path"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Banco de dados
let db;

async function iniciarBanco() {
  db = await open({
    filename: './banco.db',
    driver: sqlite3.Database
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS PRODUTOS (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      PRODUTO TEXT NOT NULL,
      PRECO REAL NOT NULL,
      QUANTIDADE INTEGER NOT NULL,
      DESCRICAO TEXT
    )
  `);
}

// Rotas
app.get('/produtos', async (req, res) => {
  const produtos = await db.all('SELECT * FROM PRODUTOS');
  res.json(produtos);
});

app.post('/produtos', async (req, res) => {
  const { produto, preco, quantidade, descricao } = req.body;

  if (!produto || isNaN(preco) || isNaN(quantidade)) {
    return res.status(400).json({ erro: 'Dados inválidos' });
  }

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

  res.json({ mensagem: 'Produto excluído!' });
});

// Iniciar servidor e banco
iniciarBanco().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
