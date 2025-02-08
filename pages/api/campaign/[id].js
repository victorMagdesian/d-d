// pages/api/campaign/[id].js

import campaigns from '../../../data/campaignStore';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (campaigns[id]) {
      return res.status(200).json(campaigns[id]);
    } else {
      return res.status(404).json({ message: 'Campanha não encontrada' });
    }
  } else if (req.method === 'PUT') {
    if (!campaigns[id]) {
      return res.status(404).json({ message: 'Campanha não encontrada' });
    }

    // Espera-se que o corpo da requisição contenha as atualizações desejadas
    const { gameState, log } = req.body;

    // Atualiza o estado do jogo se fornecido
    if (gameState) {
      campaigns[id].gameState = gameState;
    }
    // Atualiza o log se fornecido
    if (log) {
      campaigns[id].log = log;
    }

    return res.status(200).json({ message: 'Campanha atualizada com sucesso!' });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
