import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { executeAction } from '../../src/utils/gameLogic';
import { campaignChannel } from '../../src/utils/broadcast';
import styles from '../../styles/Campaign.module.css';

export default function Campaign() {
  const router = useRouter();
  const { id } = router.query;

  const [campaignData, setCampaignData] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [log, setLog] = useState([]);

  // Função para carregar os dados da campanha do backend
  const fetchCampaign = async () => {
    try {
      const res = await fetch(`/api/campaign/${id}`);
      const data = await res.json();
      if (res.ok) {
        setCampaignData(data);
        setGameState(data.gameState);
        setLog(data.log || []);
      } else {
        console.error('Campanha não encontrada:', data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar a campanha:', error);
    }
  };

  // Carrega os dados iniciais da campanha assim que o id estiver disponível
  useEffect(() => {
    if (!id) return;
    fetchCampaign();
  }, [id]);

  // Configura o BroadcastChannel para receber atualizações em outras abas
  useEffect(() => {
    if (!id) return;

    // Quando uma mensagem é recebida, atualiza o estado se a mensagem for para a campanha atual
    campaignChannel.onmessage = (event) => {
      const { campaignId, gameState: updatedGameState, log: updatedLog } = event.data;
      if (campaignId === id) {
        setGameState(updatedGameState);
        setLog(updatedLog);
      }
    };

    // Opcional: Limpa o listener ao desmontar
    return () => {
      campaignChannel.onmessage = null;
    };
  }, [id]);

  // Atualiza o backend (persistência) com os novos dados da campanha
  const updateCampaignBackend = async (newGameState, newLog) => {
    try {
      await fetch(`/api/campaign/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameState: newGameState, log: newLog }),
      });
    } catch (error) {
      console.error('Erro ao atualizar a campanha:', error);
    }
  };

  // Função que trata as ações dos jogadores
  const handleAction = (action) => {
    // Executa a ação usando a lógica definida (por exemplo, rolar dados, calcular dano, etc.)
    const { newGameState, message } = executeAction(action, gameState);
    const newLog = [...log, message];

    // Atualiza os estados locais
    setGameState(newGameState);
    setLog(newLog);

    // Atualiza o backend com os novos dados
    updateCampaignBackend(newGameState, newLog);

    // Emite a atualização para as demais abas através do BroadcastChannel
    campaignChannel.postMessage({
      campaignId: id,
      gameState: newGameState,
      log: newLog,
    });
  };

  if (!campaignData || !gameState) {
    return <div className={styles.loading}>Carregando os dados da campanha...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Campanha: {campaignData.campaignName}</h1>
      
      <div className={styles.stateSection}>
        <h2>Estado do Jogo</h2>
        <p>Pontos de vida do inimigo: {gameState.enemyHealth}</p>
      </div>

      <div className={styles.logSection}>
        <h2>Log do Jogo</h2>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>

      <div className={styles.actionsSection}>
        <h2>Ações Disponíveis</h2>
        <button onClick={() => handleAction('Atacar')} className={styles.actionButton}>
          Atacar
        </button>
        <button onClick={() => handleAction('Defender')} className={styles.actionButton}>
          Defender
        </button>
        <button onClick={() => handleAction('Usar Item')} className={styles.actionButton}>
          Usar Item
        </button>
      </div>
    </div>
  );
}
