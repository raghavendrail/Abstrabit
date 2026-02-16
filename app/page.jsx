"use client";
import { supabase } from "../lib/supabaseClient";

export default function Home() {

  const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/dashboard",
    },
  });
};


  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={loginWithGoogle}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Login with Google
      </button>
    </div>
  );
}
