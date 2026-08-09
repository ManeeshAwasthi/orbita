import type {
  AnalyticsSnapshot,
  Campaign,
  ContentItem,
  MemoryEntry,
  Mission,
  Opportunity,
  Person,
} from "./types";

export const demoCampaigns: Campaign[] = [
  {
    id: "policy-ir",
    name: "Enter Indian Policy & IR Circles",
    daysRemaining: 18,
    platforms: ["LinkedIn", "X"],
    objective: "Relationships",
    themes: ["Indian foreign policy", "AI x geopolitics", "Technology policy"],
    targets: ["Policy researchers", "Think-tank analysts", "IR students"],
    progress: {
      posts: 7,
      peopleDiscovered: 31,
      usefulInteractions: 12,
      opportunities: 3,
    },
  },
];

export const demoContent: ContentItem[] = [
  {
    id: "draft-linkedin-policy",
    platform: "LinkedIn",
    title: "India's AI policy needs institutional imagination",
    body:
      "India's AI debate is often framed as a race for compute, talent, and startups. Those matter, but the quieter question may be more important: which public institutions can translate AI capability into state capacity without flattening democratic accountability?",
    objective: "Credibility",
    audience: "Young policy researchers",
    status: "Awaiting approval",
    voiceMatch: 86,
    confidence: 72,
    recommendation:
      "The angle connects technology policy to institutional design, which fits your current campaign better than a generic AI optimism post.",
    warnings: ["No repeated guru phrases detected", "Needs source review before publishing"],
  },
  {
    id: "draft-x-geoeconomics",
    platform: "X",
    title: "Geoeconomics thread seed",
    body:
      "A useful way to read geoeconomics: countries are not just trading goods anymore. They are trading leverage, standards, choke points, and optionality.",
    objective: "Conversations",
    audience: "IR students and policy generalists",
    status: "Draft",
    voiceMatch: 81,
    confidence: 65,
    recommendation:
      "Short enough for X, but still has a concrete conceptual frame people can reply to.",
    warnings: ["Avoid turning this into a recycled thread format"],
  },
];

export const demoPeople: Person[] = [
  {
    id: "ananya-rao",
    name: "Ananya Rao",
    role: "Research Associate",
    organization: "Centre for Strategic Futures",
    domain: "Technology policy",
    platform: "LinkedIn",
    relevance: 91,
    distance: "Realistic second-degree path",
    stage: "Aware",
    tags: ["Policy", "AI", "Research"],
    why:
      "Works on public-sector AI adoption and often engages with student research posts.",
    nextAction: "Read her latest post. No outreach needed unless you have a specific response.",
    timeline: ["Aug 11 - discovered", "Aug 14 - user saved profile"],
  },
  {
    id: "kabir-menon",
    name: "Kabir Menon",
    role: "Consultant",
    organization: "Public Sector Strategy Group",
    domain: "Consulting",
    platform: "X",
    relevance: 84,
    distance: "Cold but topical overlap",
    stage: "Cold",
    tags: ["Consulting", "Economics", "Policy"],
    why:
      "Comments on state capacity, consulting, and policy implementation with a practical lens.",
    nextAction: "If he posts on implementation, consider a substantive reply.",
    timeline: ["Aug 12 - discovered through campaign topic"],
  },
];

export const demoMemory: MemoryEntry[] = [
  { id: "goals-1", category: "User goals", value: "Build credibility in AI, policy, and research circles.", editable: true },
  { id: "voice-1", category: "Writing preferences", value: "Analytical, conversational, young but intelligent.", editable: true },
  { id: "avoid-1", category: "Rejected patterns", value: "Avoid achievement spam, generic LinkedIn guru language, and fake vulnerability.", editable: true },
  { id: "topics-1", category: "Topics already covered", value: "AI policy, undergraduate research culture, geoeconomics.", editable: true },
  { id: "mode-1", category: "Operating mode", value: "Assisted by default; user approves external actions.", editable: true },
];

export const demoMissions: Mission[] = [
  {
    platform: "LinkedIn",
    action: "Review the AI policy draft and add one concrete example.",
    effort: "Medium",
    reason: "Good fit for the active policy campaign.",
  },
  {
    platform: "X",
    action: "Join one geoeconomics discussion with a non-obvious framing.",
    effort: "Low",
    reason: "Likely to create conversation without heavy posting.",
  },
  {
    platform: "Reddit",
    action: "Review two policy or academia discussions before contributing.",
    effort: "Low",
    reason: "Community context matters more than frequency.",
  },
];

export const demoOpportunities: Opportunity[] = [
  {
    title: "Policy research assistant opening",
    source: "Think-tank newsletter",
    likelihood: "Needs review",
    why: "Matches AI governance interest, but eligibility needs confirmation.",
  },
  {
    title: "Student roundtable on technology policy",
    source: "LinkedIn event",
    likelihood: "Promising",
    why: "Small room, relevant audience, realistic relationship value.",
  },
];

export const demoAnalytics: AnalyticsSnapshot[] = [
  { label: "Research posts", impressions: 2100, conversations: 14, relationships: 4, opportunities: 1 },
  { label: "Short X ideas", impressions: 3800, conversations: 9, relationships: 2, opportunities: 0 },
  { label: "Reddit contributions", impressions: 900, conversations: 11, relationships: 1, opportunities: 1 },
];
