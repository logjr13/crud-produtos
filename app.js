import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function criarEPopularTabelaProdutos(produto, preco, quantidade, descricao) {
    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

    // Criação da tabela
    await db.run(`
        CREATE TABLE IF NOT EXISTS PRODUTOS (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            PRODUTO TEXT,
            PRECO FLOAT,
            QUANTIDADE INTEGER,
            DESCRICAO TEXT
        )
    `);

    // Inserção de dados
    await db.run(`
        INSERT INTO PRODUTOS (PRODUTO, PRECO, QUANTIDADE, DESCRICAO)
        VALUES (?, ?, ?, ?)`,
        [produto, preco, quantidade, descricao]
    );

    console.log("Produto inserido com sucesso!");
}

// Chamada da função com dados reais
criarEPopularTabelaProdutos('Camiseta', 49.90, 10, 'Camiseta 100% algodão');
