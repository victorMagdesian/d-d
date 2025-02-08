// pages/api/campaign/[id].js
import { openDB } from '../../../src/utils/db';

export default async function handler(req, res) {
  const db = await openDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const campaign = await db.get(
        'SELECT * FROM campaigns WHERE id = ?',
        id
      );
      if (!campaign) {
        return res.status(404).json({ message: 'Campanha não encontrada' });
      }
      // Converte os campos JSON de volta para objeto
      campaign.players = JSON.parse(campaign.players);
      campaign.gameState = JSON.parse(campaign.gameState);
      campaign.log = JSON.parse(campaign.log);
      return res.status(200).json(campaign);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    const { gameState, log } = req.body;
    try {
      await db.run(
        'UPDATE campaigns SET gameState = ?, log = ? WHERE id = ?',
        JSON.stringify(gameState),
        JSON.stringify(log),
        id
      );
      return res
        .status(200)
        .json({ message: 'Campanha atualizada com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
