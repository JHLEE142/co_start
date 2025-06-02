// lib/api.ts
import { getToken } from "./auth";

// 🔁 환경에 따라 API URL 자동 분기
const isDev = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDev
  ? "http://127.0.0.1:8000" // 로컬 FastAPI
  : process.env.NEXT_PUBLIC_API_URL!; // 배포된 FastAPI

// 🔁 공통 fetch wrapper
async function request(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: any,
) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "API 요청 실패");
  }

  return res.json();
}

// 🔁 요청 메서드 단축 함수
export const apiGet    = (p: string)         => request("GET",    p);
export const apiPost   = (p: string, b: any) => request("POST",   p, b);
export const apiPatch  = (p: string, b: any) => request("PATCH",  p, b);
export const apiDelete = (p: string)         => request("DELETE", p);
