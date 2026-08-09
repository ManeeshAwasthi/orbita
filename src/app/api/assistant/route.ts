import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCommandPlan } from "@/lib/orbita-engine";

const requestSchema = z.object({
  command: z.string().trim().min(3).max(1200),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Tell Orbita what you want to accomplish in a sentence or two." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    mode: process.env.OPENAI_API_KEY ? "ai-ready" : "demo-strategist",
    plan: createCommandPlan(parsed.data.command),
  });
}
