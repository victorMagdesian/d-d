import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { executeAction } from '../../src/utils/gameLogic';

export default function Campaign() {
  const router = useRouter();
  const { id } = router.query;

  // Estado para armazenar os dados completos da campanha (carregados do backend)
  const [campaignData, setCampaignData] = useState(null);

  // Estados locais para manipular gameState e log
  const [gameState, setGameState] = useState(null);
  const [log, setLog] = useState([]);

  // Função para carregar os dados da campanha do backend
  const fetchCampaign = async () => {
    try {
      const res = await fetch(`/api/campaign/${id}`);
      const data = await res.json();
      if (res.ok) {
        setCampaignData(data);
        // Atualiza os estados locais somente se houver alteração
        setGameState(data.gameState);
        setLog(data.log || []);
      } else {
        console.error('Campanha não encontrada:', data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar a campanha:', error);
    }
  };

  // Carrega os dados da campanha quando o id estiver disponível
  useEffect(() => {
    if (!id) return;
    fetchCampaign();
  }, [id]);

  // Implementa polling para atualizar os dados da campanha a cada 5 segundos
  useEffect(() => {
    if (!id) return;
    const intervalId = setInterval(() => {
      fetchCampaign();
    }, 5000); // atualiza a cada 5 segundos

    return () => clearInterval(intervalId);
  }, [id]);

  // Função para atualizar a campanha no backend (quando uma ação é executada)
  const updateCampaignBackend = async (newGameState, newLog) => {
    try {
      await fetch(`/api/campaign/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameState: newGameState, log: newLog })
      });
    } catch (error) {
      console.error('Erro ao atualizar a campanha:', error);
    }
  };

  // Função para tratar as ações dos jogadores usando a lógica do jogo
  const handleAction = (action) => {
    // Aplica a ação usando a função executeAction
    const { newGameState, message } = executeAction(action, gameState);
    const newLog = [...log, message];
    setGameState(newGameState);
    setLog(newLog);
    // Atualiza o backend com os novos dados
    updateCampaignBackend(newGameState, newLog);
  };

  // Enquanto os dados não são carregados, exibe um indicador
  if (!campaignData || !gameState) {
    return <div>Carregando os dados da campanha...</div>;
  }

  return (
    <div>
      <h1>Campanha: {campaignData.campaignName}</h1>
      
      <div>
        <h2>Estado do Jogo</h2>
        <p>Pontos de vida do inimigo: {gameState.enemyHealth}</p>
        {/* Exiba outros detalhes do estado do jogo conforme necessário */}
      </div>

      <div>
        <h2>Log do Jogo</h2>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Ações Disponíveis</h2>
        <button onClick={() => handleAction('Atacar')}>Atacar</button>
        <button onClick={() => handleAction('Defender')}>Defender</button>
        <button onClick={() => handleAction('Usar Item')}>Usar Item</button>
      </div>
    </div>
  );
}
