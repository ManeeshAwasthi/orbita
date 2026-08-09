"use client";

import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  Database,
  LineChart,
  Lock,
  MessageSquareText,
  Moon,
  Network,
  PenLine,
  Radar,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserPlus,
} from "lucide-react";
import type React from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  demoAnalytics,
  demoCampaigns,
  demoContent,
  demoMemory,
  demoMissions,
  demoOpportunities,
  demoPeople,
} from "@/lib/demo-data";
import { createCommandPlan, generateDraft, opportunityYield } from "@/lib/orbita-engine";
import type { Campaign, CommandPlan, ContentItem, MemoryEntry, Person, Platform } from "@/lib/types";

const sections = [
  { id: "Home", icon: Activity },
  { id: "Create", icon: PenLine },
  { id: "Campaigns", icon: CalendarDays },
  { id: "Discover", icon: Radar },
  { id: "Network", icon: Network },
  { id: "Analytics", icon: BarChart3 },
  { id: "Memory", icon: Database },
  { id: "Settings", icon: Settings },
] as const;

type Section = (typeof sections)[number]["id"];
type PersistedState = {
  theme: "light" | "dark";
  contents: ContentItem[];
  campaigns: Campaign[];
  people: Person[];
  memory: MemoryEntry[];
  onboarded: boolean;
};

const storageKey = "orbita-demo-state-v1";

export function OrbitaApp() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [active, setActive] = useState<Section>("Home");
  const [theme, setTheme] = useState<"light" | "dark">(() => readPersistedState().theme);
  const [command, setCommand] = useState("I want to write something about India's AI policy today and reach young policy researchers.");
  const [plan, setPlan] = useState<CommandPlan | null>(null);
  const [contents, setContents] = useState<ContentItem[]>(() => readPersistedState().contents);
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => readPersistedState().campaigns);
  const [people, setPeople] = useState<Person[]>(() => readPersistedState().people);
  const [memory, setMemory] = useState<MemoryEntry[]>(() => readPersistedState().memory);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [onboarded, setOnboarded] = useState(() => readPersistedState().onboarded);

  useEffect(() => {
    const nextState: PersistedState = {
      theme,
      contents,
      campaigns,
      people,
      memory,
      onboarded,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(nextState));
  }, [theme, contents, campaigns, people, memory, onboarded]);

  const dark = theme === "dark";
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning.";
    if (hour < 17) return "Good afternoon.";
    return "Good evening.";
  }, []);

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedCode = String(formData.get("accessCode") ?? accessCode);
    if (submittedCode.trim().length > 0) setIsAuthed(true);
  }

  function runCommand() {
    const nextPlan = createCommandPlan(command);
    setPlan(nextPlan);
    if (nextPlan.draft) setContents((items) => [nextPlan.draft!, ...items]);
  }

  function createContent(platform: Platform) {
    const draft = generateDraft({
      platform,
      topic: "AI policy and public institutions",
      audience: "Young policy researchers",
      objective: "Credibility",
    });
    setContents((items) => [draft, ...items]);
    setActive("Create");
  }

  function approveContent(id: string) {
    setContents((items) =>
      items.map((item) => (item.id === id ? { ...item, status: "Awaiting approval" } : item)),
    );
  }

  function completeOnboarding() {
    setOnboarded(true);
    setMemory((items) => [
      {
        id: `onboarding-${Date.now()}`,
        category: "Onboarding",
        value: "Wants Orbita to help with policy, AI, research, relationships, and opportunity discovery.",
        editable: true,
      },
      ...items,
    ]);
  }

  if (!isAuthed) {
    return (
      <main className={dark ? "min-h-screen bg-[#0d0f12] text-[#f6f3ed]" : "min-h-screen bg-[#f7f4ee] text-[#1e1d1a]"}>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-current/10 px-3 py-1 text-sm">
                <ShieldCheck className="size-4" />
                Private demo mode
              </div>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-normal sm:text-7xl">Orbita</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 opacity-75">
                A personal AI-powered digital presence operating system for content, campaigns, relationships, memory, and meaningful opportunities.
              </p>
            </section>
            <form onSubmit={login} className="rounded-lg border border-current/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:bg-white/[0.04]">
              <Lock className="mb-6 size-7" />
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="mt-2 text-sm opacity-70">
                Use any access code in local demo mode. In production, set `ORBITA_ACCESS_CODE`.
              </p>
              <input
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value)}
                onInput={(event) => setAccessCode(event.currentTarget.value)}
                name="accessCode"
                className="mt-6 h-12 w-full rounded-md border border-current/15 bg-transparent px-4 outline-none focus:border-current/40"
                placeholder="Access code"
              />
              <button
                type="submit"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#20201d] px-4 text-sm font-medium text-white dark:bg-[#f6f3ed] dark:text-[#111]"
              >
                Enter Orbita
                <ChevronRight className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={dark ? "min-h-screen bg-[#0d0f12] text-[#f6f3ed]" : "min-h-screen bg-[#f7f4ee] text-[#1e1d1a]"}>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-current/10 px-4 py-5 lg:block">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="grid size-9 place-items-center rounded-md bg-current text-sm font-bold text-white dark:text-black">O</div>
            <div>
              <div className="font-semibold">Orbita</div>
              <div className="text-xs opacity-55">Presence OS</div>
            </div>
          </div>
          <nav className="space-y-1">
            {sections.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition ${
                  active === id ? "bg-current/10" : "hover:bg-current/5"
                }`}
              >
                <Icon className="size-4" />
                {id}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-current/10 bg-inherit/95 px-4 py-3 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 overflow-x-auto lg:hidden">
                {sections.slice(0, 6).map(({ id }) => (
                  <button key={id} onClick={() => setActive(id)} className={`h-9 whitespace-nowrap rounded-md px-3 text-sm ${active === id ? "bg-current/10" : ""}`}>
                    {id}
                  </button>
                ))}
              </div>
              <div className="hidden text-sm opacity-70 lg:block">Demo data is isolated from live integrations</div>
              <div className="flex items-center gap-2">
                <button
                  title="Toggle theme"
                  onClick={() => setTheme(dark ? "light" : "dark")}
                  className="grid size-9 place-items-center rounded-md border border-current/10"
                >
                  {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
                <button
                  title="Ask Orbita"
                  onClick={() => setAssistantOpen((value) => !value)}
                  className="grid size-9 place-items-center rounded-md border border-current/10"
                >
                  <Bot className="size-4" />
                </button>
              </div>
            </div>
          </header>

          <div className="grid flex-1 grid-cols-1 xl:grid-cols-[1fr_360px]">
            <div className="min-w-0 px-4 py-6 lg:px-8">
              {!onboarded ? <Onboarding onComplete={completeOnboarding} /> : null}
              {active === "Home" ? (
                <HomeSection
                  greeting={greeting}
                  command={command}
                  setCommand={setCommand}
                  runCommand={runCommand}
                  plan={plan}
                  createContent={createContent}
                  contents={contents}
                  campaigns={campaigns}
                />
              ) : null}
              {active === "Create" ? <CreateSection contents={contents} createContent={createContent} approveContent={approveContent} /> : null}
              {active === "Campaigns" ? <CampaignsSection campaigns={campaigns} setCampaigns={setCampaigns} /> : null}
              {active === "Discover" ? <DiscoverSection addPerson={(person) => setPeople((items) => [person, ...items])} /> : null}
              {active === "Network" ? <NetworkSection people={people} /> : null}
              {active === "Analytics" ? <AnalyticsSection /> : null}
              {active === "Memory" ? <MemorySection memory={memory} setMemory={setMemory} /> : null}
              {active === "Settings" ? (
                <SettingsSection
                  exportData={() => exportDemoData({ theme, contents, campaigns, people, memory, onboarded })}
                  resetData={() => {
                    window.localStorage.removeItem(storageKey);
                    setTheme("dark");
                    setContents(demoContent);
                    setCampaigns(demoCampaigns);
                    setPeople(demoPeople);
                    setMemory(demoMemory);
                    setOnboarded(false);
                  }}
                />
              ) : null}
            </div>
            {assistantOpen ? <AssistantPanel command={command} setCommand={setCommand} runCommand={runCommand} /> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Onboarding({ onComplete }: { onComplete: () => void }) {
  return (
    <section className="mb-6 rounded-lg border border-current/10 bg-current/[0.035] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">First-run onboarding</p>
          <h2 className="mt-1 text-2xl font-semibold">Shape Orbita around your goals</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 opacity-70">
            Current defaults: AI, strategy, geopolitics, research, economics, thoughtful networking, assisted approvals, and no generic AI writing.
          </p>
        </div>
        <button onClick={onComplete} className="h-11 rounded-md bg-current px-4 text-sm font-medium text-white dark:text-black">
          Use these defaults
        </button>
      </div>
    </section>
  );
}

function HomeSection(props: {
  greeting: string;
  command: string;
  setCommand: (value: string) => void;
  runCommand: () => void;
  plan: CommandPlan | null;
  createContent: (platform: Platform) => void;
  contents: ContentItem[];
  campaigns: Campaign[];
}) {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-lg opacity-70">{props.greeting}</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-normal">What are we doing today?</h1>
        <div className="mt-6 rounded-lg border border-current/10 bg-white/70 p-3 shadow-sm dark:bg-white/[0.04]">
          <textarea
            value={props.command}
            onChange={(event) => props.setCommand(event.target.value)}
            className="min-h-32 w-full resize-none bg-transparent p-3 text-lg leading-8 outline-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-current/10 px-3 pt-3">
            <div className="flex flex-wrap gap-2 text-xs opacity-65">
              <span>LinkedIn</span>
              <span>X</span>
              <span>Reddit</span>
              <span>Assisted mode</span>
            </div>
            <button onClick={props.runCommand} className="flex h-11 items-center gap-2 rounded-md bg-current px-4 text-sm font-medium text-white dark:text-black">
              <Sparkles className="size-4" />
              Ask Orbita
            </button>
          </div>
        </div>
      </section>

      {props.plan ? (
        <Panel title="Orbita plan" icon={Bot}>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="text-sm opacity-65">Topic</div>
              <h3 className="mt-1 text-xl font-semibold">{props.plan.topic}</h3>
              <p className="mt-2 text-sm opacity-70">Audience: {props.plan.audience}</p>
              <p className="text-sm opacity-70">Objective: {props.plan.objective}</p>
            </div>
            <ul className="space-y-2 text-sm">
              {props.plan.recommendedActions.map((action) => (
                <li key={action} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {(["LinkedIn", "X", "Reddit"] as Platform[]).map((platform) => (
          <Panel key={platform} title={platform} icon={MessageSquareText}>
            <div className="space-y-3 text-sm">
              <StatusRow label="Post status" value={props.contents.find((item) => item.platform === platform)?.status ?? "No draft"} />
              <StatusRow label="Recommended interactions" value={platform === "Reddit" ? "2 discussions" : "3 people"} />
              <StatusRow label="Discovery queue" value={platform === "X" ? "5 conversations" : "4 targets"} />
              <button onClick={() => props.createContent(platform)} className="mt-2 h-10 w-full rounded-md border border-current/15 text-sm">
                Create {platform} draft
              </button>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Active campaign" icon={CalendarDays}>
          <h3 className="font-semibold">{props.campaigns[0]?.name}</h3>
          <p className="mt-2 text-sm opacity-70">{props.campaigns[0]?.daysRemaining} days remaining. Relationship-focused recommendations are active.</p>
        </Panel>
        <Panel title="Daily missions" icon={Check}>
          <div className="space-y-3">
            {demoMissions.map((mission) => (
              <div key={`${mission.platform}-${mission.action}`} className="border-b border-current/10 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{mission.platform}</span>
                  <span className="rounded-md bg-current/10 px-2 py-1 text-xs">{mission.effort}</span>
                </div>
                <p className="mt-1 text-sm opacity-75">{mission.action}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Meaningful opportunities" icon={Search}>
          <div className="space-y-3">
            {demoOpportunities.map((opportunity) => (
              <div key={opportunity.title} className="border-b border-current/10 pb-3 last:border-0 last:pb-0">
                <div className="font-medium">{opportunity.title}</div>
                <p className="text-sm opacity-70">{opportunity.why}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function CreateSection({ contents, createContent, approveContent }: { contents: ContentItem[]; createContent: (platform: Platform) => void; approveContent: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <SectionTitle title="Create" subtitle="Platform-aware content workspace with voice and repetition safeguards." />
      <div className="flex flex-wrap gap-2">
        {(["LinkedIn", "X", "Reddit"] as Platform[]).map((platform) => (
          <button key={platform} onClick={() => createContent(platform)} className="h-10 rounded-md border border-current/15 px-4 text-sm">
            New {platform}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {contents.map((item) => (
          <Panel key={item.id} title={item.title} icon={PenLine}>
            <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
              <textarea className="min-h-40 rounded-md border border-current/10 bg-transparent p-3 text-sm leading-7 outline-none" defaultValue={item.body} />
              <div className="space-y-3 text-sm">
                <StatusRow label="Platform" value={item.platform} />
                <StatusRow label="Objective" value={item.objective} />
                <StatusRow label="Voice match" value={`${item.voiceMatch}%`} />
                <StatusRow label="Research confidence" value={`${item.confidence}%`} />
                <p className="rounded-md bg-current/5 p-3 opacity-75">{item.recommendation}</p>
                <div className="flex flex-wrap gap-2">
                  {["Research", "Rewrite", "Shorten", "More natural", "Analytical", "Informal"].map((action) => (
                    <button key={action} className="h-8 rounded-md border border-current/10 px-2 text-xs">{action}</button>
                  ))}
                </div>
                <button onClick={() => approveContent(item.id)} className="h-10 w-full rounded-md bg-current text-sm font-medium text-white dark:text-black">
                  Approve
                </button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function CampaignsSection({ campaigns, setCampaigns }: { campaigns: Campaign[]; setCampaigns: (items: Campaign[]) => void }) {
  function addCampaign() {
    setCampaigns([
      {
        id: `campaign-${Date.now()}`,
        name: "Build Management Consulting Network",
        daysRemaining: 21,
        platforms: ["LinkedIn", "X"],
        objective: "Relationships",
        themes: ["Strategy", "Public sector consulting", "Economics"],
        targets: ["Management consultants", "Policy operators", "MBA students"],
        progress: { posts: 0, peopleDiscovered: 0, usefulInteractions: 0, opportunities: 0 },
      },
      ...campaigns,
    ]);
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Campaigns" subtitle="Temporary strategic objectives that guide content, discovery, and relationship recommendations." />
      <button onClick={addCampaign} className="h-10 rounded-md bg-current px-4 text-sm font-medium text-white dark:text-black">Create 21-day campaign</button>
      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Panel key={campaign.id} title={campaign.name} icon={CalendarDays}>
            <div className="grid gap-4 lg:grid-cols-4">
              <Metric label="Days remaining" value={campaign.daysRemaining} />
              <Metric label="Posts" value={campaign.progress.posts} />
              <Metric label="People discovered" value={campaign.progress.peopleDiscovered} />
              <Metric label="Useful interactions" value={campaign.progress.usefulInteractions} />
            </div>
            <p className="mt-4 text-sm opacity-70">Best next step: publish one analytical post and review two people from the target circle. No cold outreach pressure.</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function DiscoverSection({ addPerson }: { addPerson: (person: Person) => void }) {
  return (
    <div className="space-y-5">
      <SectionTitle title="Discover" subtitle="Relevant people, conversations, topics, and opportunities without random scrolling." />
      <div className="grid gap-4 lg:grid-cols-2">
        {demoPeople.map((person) => (
          <Panel key={person.id} title={person.name} icon={UserPlus}>
            <p className="text-sm font-medium">{person.role}, {person.organization}</p>
            <p className="mt-2 text-sm opacity-70">{person.why}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm opacity-70">Relevance {person.relevance}%</span>
              <button onClick={() => addPerson({ ...person, id: `${person.id}-${Date.now()}` })} className="h-9 rounded-md border border-current/15 px-3 text-sm">Add to network</button>
            </div>
          </Panel>
        ))}
      </div>
      <Panel title="Topics worth exploring" icon={BookOpen}>
        <div className="grid gap-3 md:grid-cols-3">
          {["AI x geopolitics", "State capacity", "Undergraduate research culture"].map((topic) => (
            <div key={topic} className="rounded-md border border-current/10 p-3">
              <div className="font-medium">{topic}</div>
              <p className="mt-2 text-sm opacity-70">Recommended angle: make one precise claim, then invite specific disagreement.</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function NetworkSection({ people }: { people: Person[] }) {
  return (
    <div className="space-y-5">
      <SectionTitle title="Network" subtitle="A lightweight personal CRM for real relationships, not gamified outreach." />
      <div className="grid gap-4">
        {people.map((person) => (
          <Panel key={person.id} title={person.name} icon={Network}>
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="font-medium">{person.role}, {person.organization}</p>
                <p className="mt-2 text-sm opacity-70">{person.why}</p>
                <p className="mt-3 text-sm"><span className="opacity-60">Next suggested action:</span> {person.nextAction}</p>
              </div>
              <div className="rounded-md border border-current/10 p-3 text-sm">
                <StatusRow label="Stage" value={person.stage} />
                <StatusRow label="Platform" value={person.platform} />
                <StatusRow label="Distance" value={person.distance} />
                <div className="mt-3 flex flex-wrap gap-2">
                  {person.tags.map((tag) => <span key={tag} className="rounded-md bg-current/10 px-2 py-1 text-xs">{tag}</span>)}
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function AnalyticsSection() {
  return (
    <div className="space-y-5">
      <SectionTitle title="Analytics" subtitle="Presence, engagement, relationships, outcomes, and opportunity yield." />
      <div className="grid gap-4 lg:grid-cols-3">
        {demoAnalytics.map((snapshot) => (
          <Panel key={snapshot.label} title={snapshot.label} icon={LineChart}>
            <Metric label="Impressions" value={snapshot.impressions} />
            <Metric label="Conversations" value={snapshot.conversations} />
            <Metric label="Relationships" value={snapshot.relationships} />
            <Metric label="Opportunity yield" value={opportunityYield(snapshot)} />
          </Panel>
        ))}
      </div>
      <Panel title="Recommendation" icon={Sparkles}>
        <p className="text-sm leading-6 opacity-75">
          Research posts generate fewer impressions than short X ideas in this demo set, but they create more meaningful conversations per 1,000 impressions. Not enough live data yet for posting-time optimization.
        </p>
      </Panel>
    </div>
  );
}

function MemorySection({ memory, setMemory }: { memory: MemoryEntry[]; setMemory: (items: MemoryEntry[]) => void }) {
  return (
    <div className="space-y-5">
      <SectionTitle title="Memory" subtitle="Inspectable, editable structured memory. Nothing important is hidden in a black box." />
      <div className="grid gap-3">
        {memory.map((entry) => (
          <div key={entry.id} className="rounded-lg border border-current/10 p-4">
            <div className="text-sm font-medium opacity-65">{entry.category}</div>
            <input
              className="mt-2 w-full bg-transparent text-sm outline-none"
              value={entry.value}
              onChange={(event) =>
                setMemory(memory.map((item) => (item.id === entry.id ? { ...item, value: event.target.value } : item)))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsSection({ exportData, resetData }: { exportData: () => void; resetData: () => void }) {
  return (
    <div className="space-y-5">
      <SectionTitle title="Settings" subtitle="Profile, voice, AI, platforms, privacy, data controls, and system health." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Platform integrations" icon={ShieldCheck}>
          <StatusRow label="LinkedIn" value="Manual/assisted mode" />
          <StatusRow label="X" value="Manual/assisted mode" />
          <StatusRow label="Reddit" value="Manual/assisted mode" />
          <p className="mt-3 text-sm opacity-70">Official API connectors can be added later. Orbita will not bypass platform protections.</p>
        </Panel>
        <Panel title="System health" icon={Activity}>
          <StatusRow label="AI provider" value={process.env.NEXT_PUBLIC_DEMO_MODE === "false" ? "Configured" : "Demo adapter"} />
          <StatusRow label="Database" value="Demo browser state" />
          <StatusRow label="Average task time" value="0.8s demo" />
          <StatusRow label="Failed operations" value="0 today" />
        </Panel>
      </div>
      <Panel title="Data controls" icon={Database}>
        <p className="text-sm leading-6 opacity-75">
          Demo mode stores your working state in this browser only. Production will move this to Postgres with export and deletion flows.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={exportData} className="h-10 rounded-md border border-current/15 px-4 text-sm">Export demo data</button>
          <button onClick={resetData} className="h-10 rounded-md border border-current/15 px-4 text-sm">Reset demo data</button>
        </div>
      </Panel>
    </div>
  );
}

function AssistantPanel({ command, setCommand, runCommand }: { command: string; setCommand: (value: string) => void; runCommand: () => void }) {
  return (
    <aside className="border-l border-current/10 px-4 py-6">
      <div className="sticky top-20">
        <div className="mb-4 flex items-center gap-2">
          <Bot className="size-5" />
          <h2 className="font-semibold">Ask Orbita</h2>
        </div>
        <textarea
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          className="min-h-44 w-full resize-none rounded-md border border-current/10 bg-transparent p-3 text-sm leading-6 outline-none"
        />
        <button onClick={runCommand} className="mt-3 h-10 w-full rounded-md bg-current text-sm font-medium text-white dark:text-black">
          Generate plan
        </button>
        <div className="mt-5 rounded-md border border-current/10 p-3 text-sm leading-6 opacity-75">
          Orbita recommends, prepares, and explains. You approve genuine interactions.
        </div>
      </div>
    </aside>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Activity; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-current/10 bg-white/60 p-4 shadow-sm dark:bg-white/[0.035]">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 opacity-70" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 opacity-70">{subtitle}</p>
    </section>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="opacity-60">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-current/10 p-3">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs uppercase opacity-55">{label}</div>
    </div>
  );
}

function exportDemoData(state: PersistedState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `orbita-demo-export-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function readPersistedState(): PersistedState {
  const fallback: PersistedState = {
    theme: "dark",
    contents: demoContent,
    campaigns: demoCampaigns,
    people: demoPeople,
    memory: demoMemory,
    onboarded: false,
  };

  if (typeof window === "undefined") return fallback;

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved) as Partial<PersistedState>;

    return {
      theme: parsed.theme === "light" || parsed.theme === "dark" ? parsed.theme : fallback.theme,
      contents: Array.isArray(parsed.contents) ? parsed.contents : fallback.contents,
      campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : fallback.campaigns,
      people: Array.isArray(parsed.people) ? parsed.people : fallback.people,
      memory: Array.isArray(parsed.memory) ? parsed.memory : fallback.memory,
      onboarded: typeof parsed.onboarded === "boolean" ? parsed.onboarded : fallback.onboarded,
    };
  } catch {
    window.localStorage.removeItem(storageKey);
    return fallback;
  }
}
