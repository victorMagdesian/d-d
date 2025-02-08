import { signIn, signOut, useSession } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Bem-vindo, {session.user.name}!</p>
        <button onClick={() => signOut()} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Sair
        </button>
      </div>
    );
  }
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Login</h1>
      <form method="post" action="/api/auth/callback/credentials">
        {/* O token CSRF é opcional em uma implementação básica */}
        <div style={{ margin: "10px 0" }}>
          <label>
            Usuário: <input name="username" type="text" required />
          </label>
        </div>
        <div style={{ margin: "10px 0" }}>
          <label>
            Senha: <input name="password" type="password" required />
          </label>
        </div>
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
