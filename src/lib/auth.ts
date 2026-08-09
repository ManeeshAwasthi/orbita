import { cookies } from "next/headers";

export const SESSION_COOKIE = "orbita_session";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === "demo-session";
}

export function isValidAccessCode(code: string) {
  const configured = process.env.ORBITA_ACCESS_CODE;
  if (!configured) return code.trim().length >= 1;
  return code === configured;
}
