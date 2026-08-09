import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isValidAccessCode, SESSION_COOKIE } from "@/lib/auth";

const loginSchema = z.object({
  accessCode: z.string().trim().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success || !isValidAccessCode(parsed.data.accessCode)) {
    return NextResponse.json({ error: "That access code did not work." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "demo-session", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
