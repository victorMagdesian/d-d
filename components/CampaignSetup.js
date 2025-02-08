import { useState } from 'react';

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
    // Aqui, você pode incluir mais validações ou preparar os dados conforme necessário.
    onStart({ campaignName, players });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome da Campanha: </label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          required
        />
      </div>
      {players.map((player, index) => (
        <div key={index}>
          <label>Jogador {index + 1} Nome: </label>
          <input
            type="text"
            value={player.name}
            onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
            required
          />
          <label>Classe: </label>
          <input
            type="text"
            value={player.class}
            onChange={(e) => handlePlayerChange(index, 'class', e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={addPlayer}>Adicionar Jogador</button>
      <button type="submit">Iniciar Campanha</button>
    </form>
  );
}
