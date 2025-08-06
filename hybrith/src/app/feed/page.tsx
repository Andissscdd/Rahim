import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const router = useRouter();

  useEffect(() => {
    const current = localStorage.getItem("hybrith_current_user");
    if (!current) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">Bienvenue sur le flux vidéo HYBRITH 🚀</h1>
    </div>
  );
}