import { NextResponse } from "next/server";
import { ensureCoreSchema, hasDatabase } from "@/lib/db";

export async function GET() {
  let database = false;
  if (hasDatabase()) {
    try {
      await ensureCoreSchema();
      database = true;
    } catch {
      database = false;
    }
  }

  return NextResponse.json({
    status: "ok",
    demoMode: !database,
    integrations: {
      database,
      ai: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY),
      aiProvider: process.env.GEMINI_API_KEY ? "gemini" : process.env.OPENAI_API_KEY ? "openai" : "demo",
      linkedIn: Boolean(process.env.LINKEDIN_CLIENT_ID),
      x: Boolean(process.env.X_CLIENT_ID),
      reddit: Boolean(process.env.REDDIT_CLIENT_ID),
      vercel: Boolean(process.env.VERCEL_TOKEN),
    },
  });
}
