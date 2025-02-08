import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  // Configure os providers de autenticação
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        username: { label: "Usuário", type: "text", placeholder: "Digite seu usuário" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials, req) {
        // Lógica simples para autenticação:
        // Neste exemplo, se usuário e senha forem 'admin', a autenticação é bem-sucedida.
        if (credentials.username === "admin" && credentials.password === "admin") {
          return { id: 1, name: "Admin", email: "admin@example.com" };
        }
        // Se a autenticação falhar, retorne null
        return null;
      }
    })
  ],
  // Use JWT para gerenciar a sessão
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "minha-chave-secreta" //TODO: Em produção, utilize uma variável de ambiente segura.
});
