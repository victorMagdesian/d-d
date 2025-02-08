import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Função que abre (ou cria) o banco de dados e garante que a tabela de campanhas exista.
export async function openDB() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  // Cria a tabela de campanhas se ela ainda não existir.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaignName TEXT,
      players TEXT,
      gameState TEXT,
      log TEXT
    )
  `);

  return db;
}
