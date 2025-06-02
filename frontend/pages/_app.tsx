// pages/_app.tsx
import "@/styles/global.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

export default function MyApp({ Component, pageProps }: AppProps) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth(); // ✅ 앱 시작 시 자동 로그인 초기화
  }, [initAuth]);

  return <Component {...pageProps} />;
}