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

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const current = localStorage.getItem("hybrith_current_user");
    if (current) router.replace("/feed");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users: User[] = JSON.parse(localStorage.getItem("hybrith_users") || "[]");
    const found = users.find(
      (u) => (u.username === identifier || u.email === identifier) && u.password === password,
    );
    if (!found) {
      setError("Identifiants incorrects");
      return;
    }
    localStorage.setItem("hybrith_current_user", JSON.stringify(found));
    router.push("/feed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-purple-900 to-green-700 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur p-8 shadow-xl border border-white/20">
        <h2 className="text-center text-3xl font-bold text-white mb-6">Connexion</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Pseudo ou email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            Se connecter
          </button>
          <p className="text-center text-sm text-white/80">
            Pas encore de compte ? {" "}
            <a href="/signup" className="underline hover:text-violet-300">
              S'inscrire
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}