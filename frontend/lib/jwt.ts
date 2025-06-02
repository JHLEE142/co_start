export function decodeJWT(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("JWT decoding error:", err);
    return null;
  }
}
