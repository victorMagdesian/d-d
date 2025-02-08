import { useState } from 'react';
import styles from '../styles/CampaignSetup.module.css';

export default function CampaignSetup({ onStart }) {
  const [campaignName, setCampaignName] = useState('');
  const [players, setPlayers] = useState([{ name: '', class: '' }]);

  const addPlayer = () => {
    setPlayers([...players, { name: '', class: '' }]);
  };

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ campaignName, players });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label>Nome da Campanha:</label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      {players.map((player, index) => (
        <div key={index} className={styles.playerGroup}>
          <p>Jogador {index + 1}</p>
          <label>Nome:</label>
          <input
            type="text"
            value={player.name}
            onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
            required
            className={styles.input}
          />
          <label>Classe:</label>
          <input
            type="text"
            value={player.class}
            onChange={(e) => handlePlayerChange(index, 'class', e.target.value)}
            required
            className={styles.input}
          />
        </div>
      ))}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={addPlayer}
          className={styles.button}
        >
          Adicionar Jogador
        </button>
        <button type="submit" className={styles.buttonPrimary}>
          Iniciar Campanha
        </button>
      </div>
    </form>
  );
}
