import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { z } from "zod";
import { createCommandPlan, generateDraft } from "./orbita-engine";
import type { CommandPlan, ContentItem, Objective, Platform } from "./types";

type AiMode = "gemini" | "openai" | "demo";

const contentItemSchema = z.object({
  id: z.string(),
  platform: z.enum(["LinkedIn", "X", "Reddit"]),
  title: z.string(),
  body: z.string(),
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
  audience: z.string(),
  status: z.enum(["Draft", "Awaiting approval", "Scheduled", "Published"]),
  voiceMatch: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  recommendation: z.string(),
  warnings: z.array(z.string()),
});

const commandPlanSchema = z.object({
  intent: z.string(),
  platforms: z.array(z.enum(["LinkedIn", "X", "Reddit"])),
  topic: z.string(),
  audience: z.string(),
  objective: contentItemSchema.shape.objective,
  recommendedActions: z.array(z.string()),
  draft: contentItemSchema.optional(),
});

const objectiveEnum = [
  "Reach",
  "Credibility",
  "Conversations",
  "Networking",
  "Opportunity",
  "Thought leadership",
  "Relationships",
  "Authority",
  "Followers",
] as const;

const contentItemJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id", "platform", "title", "body", "objective", "audience", "status", "voiceMatch", "confidence", "recommendation", "warnings"],
  properties: {
    id: { type: "string" },
    platform: { enum: ["LinkedIn", "X", "Reddit"], type: "string" },
    title: { type: "string" },
    body: { type: "string" },
    objective: { enum: objectiveEnum, type: "string" },
    audience: { type: "string" },
    status: { enum: ["Draft", "Awaiting approval", "Scheduled", "Published"], type: "string" },
    voiceMatch: { type: "number" },
    confidence: { type: "number" },
    recommendation: { type: "string" },
    warnings: { type: "array", items: { type: "string" } },
  },
};

const commandPlanJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["intent", "platforms", "topic", "audience", "objective", "recommendedActions", "draft"],
  properties: {
    intent: { type: "string" },
    platforms: { type: "array", items: { enum: ["LinkedIn", "X", "Reddit"], type: "string" } },
    topic: { type: "string" },
    audience: { type: "string" },
    objective: { enum: objectiveEnum, type: "string" },
    recommendedActions: { type: "array", items: { type: "string" } },
    draft: contentItemJsonSchema,
  },
};

function provider(): AiMode {
  const requested = process.env.AI_PROVIDER?.toLowerCase();
  if (requested === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (requested === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "demo";
}

function getOpenAiClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

function openAiModel() {
  return process.env.OPENAI_MODEL || "gpt-5-mini";
}

function geminiModel() {
  return process.env.GEMINI_MODEL || "gemini-3.6-flash";
}

function normalizeScore(value: number) {
  const percentage = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, Math.round(percentage)));
}

function normalizeContentItem(item: ContentItem): ContentItem {
  return {
    ...item,
    voiceMatch: normalizeScore(item.voiceMatch),
    confidence: normalizeScore(item.confidence),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : fallback;
}

function readPlatform(value: unknown, fallback: Platform): Platform {
  return value === "LinkedIn" || value === "X" || value === "Reddit" ? value : fallback;
}

function readObjective(value: unknown, fallback: Objective): Objective {
  return objectiveEnum.find((objective) => objective.toLowerCase() === String(value).toLowerCase()) ?? fallback;
}

function readStatus(value: unknown, fallback: ContentItem["status"]): ContentItem["status"] {
  return value === "Draft" || value === "Awaiting approval" || value === "Scheduled" || value === "Published" ? value : fallback;
}

function parseContentItem(value: unknown, fallback: ContentItem): ContentItem {
  const parsed = contentItemSchema.safeParse(value);
  if (parsed.success) return normalizeContentItem(parsed.data);

  const record = asRecord(value);
  return normalizeContentItem({
    id: readString(record.id, fallback.id),
    platform: readPlatform(record.platform, fallback.platform),
    title: readString(record.title, fallback.title),
    body: readString(record.body, fallback.body),
    objective: readObjective(record.objective, fallback.objective),
    audience: readString(record.audience, fallback.audience),
    status: readStatus(record.status, fallback.status),
    voiceMatch: readNumber(record.voiceMatch, fallback.voiceMatch),
    confidence: readNumber(record.confidence, fallback.confidence),
    recommendation: readString(record.recommendation, fallback.recommendation),
    warnings: readStringArray(record.warnings, fallback.warnings),
  });
}

function parseCommandPlan(value: unknown, fallback: CommandPlan): CommandPlan {
  const parsed = commandPlanSchema.safeParse(value);
  if (parsed.success) {
    return {
      ...parsed.data,
      draft: parsed.data.draft ? normalizeContentItem(parsed.data.draft) : undefined,
    };
  }

  const record = asRecord(value);
  const platforms = Array.isArray(record.platforms)
    ? record.platforms.filter((platform): platform is Platform => platform === "LinkedIn" || platform === "X" || platform === "Reddit")
    : fallback.platforms;

  return {
    intent: readString(record.intent, fallback.intent),
    platforms: platforms.length > 0 ? platforms : fallback.platforms,
    topic: readString(record.topic, fallback.topic),
    audience: readString(record.audience, fallback.audience),
    objective: readObjective(record.objective, fallback.objective),
    recommendedActions: readStringArray(record.recommendedActions, fallback.recommendedActions),
    draft: record.draft && fallback.draft ? parseContentItem(record.draft, fallback.draft) : fallback.draft,
  };
}

export async function createAiCommandPlan(command: string): Promise<{ mode: AiMode; plan: CommandPlan }> {
  const fallback = createCommandPlan(command);
  const selectedProvider = provider();

  if (selectedProvider === "gemini") {
    const client = getGeminiClient();
    if (!client) return { mode: "demo", plan: fallback };

    try {
      const response = await client.models.generateContent({
        model: geminiModel(),
        contents: `Create an Orbita command plan for this request: ${command}`,
        config: {
          systemInstruction:
            "You are Orbita, a personal digital presence strategist. Create platform-aware, human-led plans. Never recommend spam, fake engagement, mass messaging, or automated social abuse. Return JSON only.",
          responseMimeType: "application/json",
          responseJsonSchema: commandPlanJsonSchema,
        },
      });

      const parsed = parseCommandPlan(JSON.parse(response.text ?? "{}"), fallback);
      return { mode: "gemini", plan: { ...parsed, draft: parsed.draft ? { ...parsed.draft, id: `gemini-${Date.now()}` } : undefined } };
    } catch {
      return { mode: "demo", plan: fallback };
    }
  }

  const client = getOpenAiClient();
  if (!client) return { mode: "demo", plan: fallback };

  try {
    const response = await client.responses.create({
      model: openAiModel(),
      input: [
        {
          role: "system",
          content:
            "You are Orbita, a personal digital presence strategist. Create platform-aware, human-led plans. Never recommend spam, fake engagement, mass messaging, or automated social abuse. Return JSON only.",
        },
        {
          role: "user",
          content: `Create an Orbita command plan for this request: ${command}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "orbita_command_plan",
          schema: {
            ...commandPlanJsonSchema,
          },
          strict: true,
        },
      },
    });

    const parsed = parseCommandPlan(JSON.parse(response.output_text), fallback);
    return { mode: "openai", plan: { ...parsed, draft: parsed.draft ? { ...parsed.draft, id: `openai-${Date.now()}` } : undefined } };
  } catch {
    return { mode: "demo", plan: fallback };
  }
}

export async function createAiDraft(input: {
  platform: Platform;
  topic: string;
  audience: string;
  objective: Objective;
}): Promise<{ mode: AiMode; draft: ContentItem }> {
  const fallback = generateDraft(input);
  const selectedProvider = provider();

  if (selectedProvider === "gemini") {
    const client = getGeminiClient();
    if (!client) return { mode: "demo", draft: fallback };

    try {
      const response = await client.models.generateContent({
        model: geminiModel(),
        contents: `Create a ${input.platform} draft about ${input.topic} for ${input.audience}. Objective: ${input.objective}.`,
        config: {
          systemInstruction:
            "You are Orbita's writer. Write analytical, conversational, natural content. Avoid generic LinkedIn guru language, fake vulnerability, excessive emojis, spam, and identical cross-posting. Return JSON only.",
          responseMimeType: "application/json",
          responseJsonSchema: contentItemJsonSchema,
        },
      });

      const parsed = parseContentItem(JSON.parse(response.text ?? "{}"), fallback);
      return { mode: "gemini", draft: { ...parsed, id: `gemini-${Date.now()}` } };
    } catch {
      return { mode: "demo", draft: fallback };
    }
  }

  const client = getOpenAiClient();
  if (!client) return { mode: "demo", draft: fallback };

  try {
    const response = await client.responses.create({
      model: openAiModel(),
      input: [
        {
          role: "system",
          content:
            "You are Orbita's writer. Write analytical, conversational, natural content. Avoid generic LinkedIn guru language, fake vulnerability, excessive emojis, spam, and identical cross-posting. Return JSON only.",
        },
        {
          role: "user",
          content: `Create a ${input.platform} draft about ${input.topic} for ${input.audience}. Objective: ${input.objective}.`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "orbita_content_item",
          schema: {
            ...contentItemJsonSchema,
          },
          strict: true,
        },
      },
    });

    const parsed = parseContentItem(JSON.parse(response.output_text), fallback);
    return { mode: "openai", draft: { ...parsed, id: `openai-${Date.now()}` } };
  } catch {
    return { mode: "demo", draft: fallback };
  }
}
