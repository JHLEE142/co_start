// pages/signup.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSignup = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "signup", email, password, nickname }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful! Please login.");
      router.push("/login");
    } else {
      alert(data.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSignup} className="w-full bg-indigo-600 text-white p-2 rounded">
          Sign Up
        </button>

      {/* ✅ 여기에 추가 */}
      <div className="text-center">
        <a href="/login" className="text-blue-500 hover:underline mt-2 inline-block">
          Already have an account? Login
        </a>
      </div>

      </div>
    </div>
  );
}
