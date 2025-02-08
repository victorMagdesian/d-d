import { useRouter } from 'next/router';
import CampaignSetup from '../components/CampaignSetup';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();

  const handleStartCampaign = async (campaignData) => {
    try {
      const response = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });
      const data = await response.json();
      if (data.id) {
        router.push(`/campaign/${data.id}`);
      } else {
        console.error('Erro ao criar a campanha:', data);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Iniciar Nova Campanha</h1>
      <div className={styles.formWrapper}>
        <CampaignSetup onStart={handleStartCampaign} />
      </div>
    </div>
  );
}
