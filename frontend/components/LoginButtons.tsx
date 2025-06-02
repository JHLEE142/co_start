"use client";

import React from "react";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";

export default function LoginButtons() {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useUserStore((s) => s.setUser);

  const openOAuthPopup = (provider: "google" | "github") => {
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`,
      `${provider}-login`,
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const handleMessage = (event: MessageEvent) => {
      if (!event.data?.token || !event.data?.user) return;
      setToken(event.data.token);
      setUser(event.data.user);
      localStorage.setItem("token", event.data.token);
      popup?.close();
      window.removeEventListener("message", handleMessage);
      window.location.reload();
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => openOAuthPopup("google")} className="btn">Google 로그인</button>
      <button onClick={() => openOAuthPopup("github")} className="btn">GitHub 로그인</button>
    </div>
  );
}
