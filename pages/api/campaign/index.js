// pages/api/campaign/index.js
import { openDB } from '../../../src/utils/db';

export default async function handler(req, res) {
  const db = await openDB();

  if (req.method === 'POST') {
    const { campaignName, players } = req.body;
    // Estado inicial da campanha
    const initialState = { enemyHealth: 100 };
    const initialLog = [];

    try {
      // Insere uma nova campanha no banco de dados
      const result = await db.run(
        'INSERT INTO campaigns (campaignName, players, gameState, log) VALUES (?, ?, ?, ?)',
        campaignName,
        JSON.stringify(players),
        JSON.stringify(initialState),
        JSON.stringify(initialLog)
      );
      const id = result.lastID;
      return res
        .status(201)
        .json({ id, message: 'Campanha criada com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    // Retorna todas as campanhas (para testes ou listagem)
    try {
      const campaigns = await db.all('SELECT * FROM campaigns');
      return res.status(200).json({ campaigns });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
