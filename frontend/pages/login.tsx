"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "@/store/user";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();

  const handleLogin = async () => {
    if (email === "test@test.com" && password === "test1234") {
      setUser({
        id: "test-user",
        email: "test@test.com",
        name: "Test User",
        plan: "Pro",
        credit_usage: 9999,
      });
      router.push("/"); // ✅ 기존 "/dashboard" → "/" 로 변경
    } else {
      alert("Invalid test account.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Test Account Login</h1>
      <input
        className="mb-2 border px-4 py-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-2 border px-4 py-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
