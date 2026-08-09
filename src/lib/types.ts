export type Platform = "LinkedIn" | "X" | "Reddit";

export type Objective =
  | "Reach"
  | "Credibility"
  | "Conversations"
  | "Networking"
  | "Opportunity"
  | "Thought leadership"
  | "Relationships"
  | "Authority"
  | "Followers";

export type OperatingMode = "Copilot" | "Assisted" | "Autopilot";

export type RelationshipStage =
  | "Cold"
  | "Aware"
  | "Connected"
  | "Warm"
  | "Relationship";

export type ContentItem = {
  id: string;
  platform: Platform;
  title: string;
  body: string;
  objective: Objective;
  audience: string;
  status: "Draft" | "Awaiting approval" | "Scheduled" | "Published";
  voiceMatch: number;
  confidence: number;
  recommendation: string;
  warnings: string[];
};

export type Campaign = {
  id: string;
  name: string;
  daysRemaining: number;
  platforms: Platform[];
  objective: Objective;
  themes: string[];
  targets: string[];
  progress: {
    posts: number;
    peopleDiscovered: number;
    usefulInteractions: number;
    opportunities: number;
  };
};

export type Person = {
  id: string;
  name: string;
  role: string;
  organization: string;
  domain: string;
  platform: Platform;
  relevance: number;
  distance: string;
  stage: RelationshipStage;
  tags: string[];
  why: string;
  nextAction: string;
  timeline: string[];
};

export type MemoryEntry = {
  id: string;
  category: string;
  value: string;
  editable: boolean;
};

export type Mission = {
  platform: Platform;
  action: string;
  effort: "Low" | "Medium";
  reason: string;
};

export type Opportunity = {
  title: string;
  source: string;
  likelihood: "Possible" | "Promising" | "Needs review";
  why: string;
};

export type AnalyticsSnapshot = {
  label: string;
  impressions: number;
  conversations: number;
  relationships: number;
  opportunities: number;
};

export type CommandPlan = {
  intent: string;
  platforms: Platform[];
  topic: string;
  audience: string;
  objective: Objective;
  recommendedActions: string[];
  draft?: ContentItem;
};
