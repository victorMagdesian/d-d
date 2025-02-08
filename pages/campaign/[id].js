import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { executeAction } from '../../src/utils/gameLogic';
import styles from '../../styles/Campaign.module.css';

export default function Campaign() {
  const router = useRouter();
  const { id } = router.query;

  const [campaignData, setCampaignData] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [log, setLog] = useState([]);

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

  useEffect(() => {
    if (!id) return;
    fetchCampaign();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const intervalId = setInterval(() => {
      fetchCampaign();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [id]);

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

  const handleAction = (action) => {
    const { newGameState, message } = executeAction(action, gameState);
    const newLog = [...log, message];
    setGameState(newGameState);
    setLog(newLog);
    updateCampaignBackend(newGameState, newLog);
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
