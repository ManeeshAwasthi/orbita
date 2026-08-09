import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    demoMode: !process.env.DATABASE_URL,
    integrations: {
      database: Boolean(process.env.DATABASE_URL),
      ai: Boolean(process.env.OPENAI_API_KEY),
      linkedIn: Boolean(process.env.LINKEDIN_CLIENT_ID),
      x: Boolean(process.env.X_CLIENT_ID),
      reddit: Boolean(process.env.REDDIT_CLIENT_ID),
      vercel: Boolean(process.env.VERCEL_TOKEN),
    },
  });
}
