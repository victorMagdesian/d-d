import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    // Se já estiver inicializado, apenas encerre a requisição
    console.log("Socket.IO já foi inicializado.");
  } else {
    console.log("Inicializando Socket.IO...");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    // Configurando eventos de conexão
    io.on("connection", (socket) => {
      console.log("Novo cliente conectado.");

      // Permite que um cliente se junte a uma "sala" específica de campanha
      socket.on("joinCampaign", (campaignId) => {
        socket.join(campaignId);
        console.log(`Cliente juntou-se à campanha ${campaignId}`);
      });

      // Ao receber uma atualização da campanha, o servidor a encaminha para os demais clientes na mesma sala
      socket.on("updateCampaign", (campaignId, data) => {
        console.log("Campanha atualizada:", campaignId, data);
        socket.to(campaignId).emit("campaignUpdated", data);
      });
    });
  }
  res.end();
}
