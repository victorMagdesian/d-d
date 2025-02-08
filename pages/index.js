import { useRouter } from 'next/router';
import CampaignSetup from '../components/CampaignSetup';

export default function Home() {
  const router = useRouter();

  const handleStartCampaign = async (campaignData) => {
    try {
      // Envia os dados da campanha para o endpoint de criação
      const response = await fetch('/api/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
      });
      const data = await response.json();
      if (data.id) {
        // Redireciona para a página da campanha usando o ID retornado
        router.push(`/campaign/${data.id}`);
      } else {
        console.error('Erro ao criar a campanha:', data);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div>
      <h1>Iniciar Nova Campanha</h1>
      <CampaignSetup onStart={handleStartCampaign} />
    </div>
  );
}
