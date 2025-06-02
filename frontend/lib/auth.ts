// lib/auth.ts
export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
//  return localStorage.getItem("token");
  if (typeof window === "undefined") return null;
    return localStorage.getItem("token"); // 또는 쿠키 기반
}

export function removeToken() {
  localStorage.removeItem("token");
}
