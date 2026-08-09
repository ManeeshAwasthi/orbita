import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateDraft } from "@/lib/orbita-engine";

const contentSchema = z.object({
  platform: z.enum(["LinkedIn", "X", "Reddit"]),
  topic: z.string().trim().min(3).max(240),
  audience: z.string().trim().min(2).max(180),
  objective: z.enum([
    "Reach",
    "Credibility",
    "Conversations",
    "Networking",
    "Opportunity",
    "Thought leadership",
    "Relationships",
    "Authority",
    "Followers",
  ]),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = contentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Orbita needs a platform, topic, audience, and objective to create a draft." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    mode: process.env.OPENAI_API_KEY ? "ai-ready" : "demo-writer",
    draft: generateDraft(parsed.data),
  });
}
