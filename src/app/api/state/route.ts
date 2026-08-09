import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, readUserPreference, writeUserPreference } from "@/lib/db";

const persistedStateSchema = z.object({
  theme: z.enum(["light", "dark"]),
  contents: z.array(z.unknown()),
  campaigns: z.array(z.unknown()),
  people: z.array(z.unknown()),
  memory: z.array(z.unknown()),
  onboarded: z.boolean(),
});

const preferenceKey = "orbita_app_state_v1";

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ mode: "browser", state: null });
  }

  try {
    const state = await readUserPreference(preferenceKey);
    return NextResponse.json({ mode: "database", state });
  } catch {
    return NextResponse.json(
      { mode: "browser", state: null, error: "Database is configured but not ready yet." },
      { status: 503 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = persistedStateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Orbita could not save that app state." }, { status: 400 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ mode: "browser", saved: false });
  }

  try {
    await writeUserPreference(preferenceKey, parsed.data);
    return NextResponse.json({ mode: "database", saved: true });
  } catch {
    return NextResponse.json(
      { mode: "browser", saved: false, error: "Database save failed; browser copy is still available." },
      { status: 503 },
    );
  }
}
