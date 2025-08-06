import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  friends: string[];
}

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, redirect to feed
    const current = localStorage.getItem("hybrith_current_user");
    if (current) router.replace("/feed");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    const users: User[] = JSON.parse(localStorage.getItem("hybrith_users") || "[]");
    if (users.find((u) => u.username === username)) {
      setError("Ce pseudo est déjà utilisé.");
      return;
    }
    const newUser: User = {
      username,
      email,
      password,
      friends: [],
    };
    users.push(newUser);
    localStorage.setItem("hybrith_users", JSON.stringify(users));
    localStorage.setItem("hybrith_current_user", JSON.stringify(newUser));
    router.push("/feed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-purple-900 to-green-700 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur p-8 shadow-xl border border-white/20">
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          Création de compte
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Pseudo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <button
            type="submit"
            className="mt-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            S'inscrire
          </button>
          <p className="text-center text-sm text-white/80">
            Déjà un compte ? {" "}
            <a href="/login" className="underline hover:text-violet-300">
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}