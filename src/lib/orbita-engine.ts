import { z } from "zod";
import type { CommandPlan, ContentItem, Objective, Platform } from "./types";

const commandSchema = z.object({
  command: z.string().trim().min(3).max(1200),
});

const bannedPhrases = [
  "i'm thrilled to announce",
  "i'm humbled to share",
  "here are 5 lessons",
  "consistency is key",
  "agree?",
  "thoughts?",
  "your network is your net worth",
  "failure isn't failure",
];

const platforms: Platform[] = ["LinkedIn", "X", "Reddit"];

export function detectPlatforms(input: string): Platform[] {
  const text = input.toLowerCase();
  const matches = platforms.filter((platform) => {
    if (platform === "X") return /\bx\b|twitter|tweet|thread/.test(text);
    return text.includes(platform.toLowerCase());
  });

  if (matches.length > 0) return matches;
  if (text.includes("post") || text.includes("write")) return ["LinkedIn"];
  return ["LinkedIn", "X", "Reddit"];
}

export function inferObjective(input: string): Objective {
  const text = input.toLowerCase();
  if (text.includes("network") || text.includes("people")) return "Networking";
  if (text.includes("conversation") || text.includes("discuss")) return "Conversations";
  if (text.includes("opportun")) return "Opportunity";
  if (text.includes("authority") || text.includes("credib")) return "Credibility";
  if (text.includes("follower")) return "Followers";
  return "Thought leadership";
}

export function extractTopic(input: string): string {
  const cleaned = input
    .replace(/i want to|give me|find me|write something|today|for linkedin|for reddit|for x/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 8 ? sentenceCase(cleaned) : "AI policy and public institutions";
}

export function inferAudience(input: string): string {
  const text = input.toLowerCase();
  if (text.includes("policy researcher")) return "Young policy researchers";
  if (text.includes("consult")) return "Management consultants";
  if (text.includes("student")) return "Students and early-career researchers";
  if (text.includes("founder")) return "Founders and operators";
  return "Intelligent generalists in your target circles";
}

export function createCommandPlan(rawCommand: string): CommandPlan {
  const { command } = commandSchema.parse({ command: rawCommand });
  const platforms = detectPlatforms(command);
  const topic = extractTopic(command);
  const audience = inferAudience(command);
  const objective = inferObjective(command);
  const primaryPlatform = platforms[0] ?? "LinkedIn";

  return {
    intent: command,
    platforms,
    topic,
    audience,
    objective,
    recommendedActions: [
      `Draft one ${primaryPlatform} piece tailored to ${audience}.`,
      "Check whether the claim needs fresh sources before publishing.",
      "Identify 2-3 relevant people or conversations, but keep outreach human-led.",
    ],
    draft: generateDraft({
      platform: primaryPlatform,
      topic,
      audience,
      objective,
    }),
  };
}

export function generateDraft(input: {
  platform: Platform;
  topic: string;
  audience: string;
  objective: Objective;
}): ContentItem {
  const base = draftBody(input.platform, input.topic);
  const warnings = bannedPhrases.some((phrase) => base.toLowerCase().includes(phrase))
    ? ["Contains banned voice pattern. Rewrite before use."]
    : ["No banned voice patterns detected", "Manual source check recommended"];

  return {
    id: `draft-${Date.now()}`,
    platform: input.platform,
    title: `${input.platform} draft: ${input.topic}`,
    body: base,
    objective: input.objective,
    audience: input.audience,
    status: "Draft",
    voiceMatch: 84,
    confidence: 62,
    recommendation:
      "This angle is specific enough to invite serious replies without sounding like generic AI content.",
    warnings,
  };
}

export function opportunityYield(snapshot: {
  conversations: number;
  relationships: number;
  opportunities: number;
  impressions: number;
}) {
  if (snapshot.impressions <= 0) return 0;
  return Number(
    (((snapshot.conversations * 1.5 + snapshot.relationships * 4 + snapshot.opportunities * 8) /
      snapshot.impressions) *
      1000).toFixed(2),
  );
}

function draftBody(platform: Platform, topic: string) {
  if (platform === "X") {
    return `${topic}: the interesting part is not the obvious headline. It is the second-order effect - who gains capacity, who loses optionality, and which institutions become more important because of it.`;
  }

  if (platform === "Reddit") {
    return `I have been thinking about ${topic.toLowerCase()}. The usual debate feels a bit too clean to me. What matters is probably the messy middle: incentives, institutions, and whether the people affected by a policy can actually contest it. Curious how others here are reading it.`;
  }

  return `I have been thinking about ${topic.toLowerCase()} as less of a technology story and more of an institutional one. The public conversation often rewards big predictions, but the practical question is quieter: what would need to be true for this to create real capacity instead of another layer of noise?`;
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
