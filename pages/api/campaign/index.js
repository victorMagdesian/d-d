// pages/api/campaign/index.js

import campaigns from '../../../data/campaignStore';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Extrai os dados enviados na requisição
    const { campaignName, players } = req.body;
    // Gera um ID único para a campanha
    const id = Math.random().toString(36).substr(2, 9);
    // Cria a campanha com um estado inicial
    campaigns[id] = {
      id,
      campaignName,
      players,
      gameState: {
        enemyHealth: 100, // exemplo de atributo do estado do jogo
        // Outros atributos podem ser adicionados conforme necessário
      },
      log: []
    };
    return res.status(201).json({ id, message: 'Campanha criada com sucesso!' });
  } else if (req.method === 'GET') {
    // Retorna todas as campanhas armazenadas
    return res.status(200).json({ campaigns });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
}
