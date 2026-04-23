import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MUSIC_PROMPT_SYSTEM = `You are an expert in AI music generation and metal music production. You craft detailed, technically precise prompts for AI music generators like Suno, Udio, and Stable Audio.

Your prompts include:
- Exact genre and subgenre descriptors
- Instrumentation (specific guitar tunings, drum patterns, bass style)
- Production style (raw/lo-fi vs polished/modern, specific producers or albums as reference)
- Tempo range in BPM
- Key/mode or scale (e.g., Phrygian dominant, natural minor)
- Mood and atmosphere descriptors
- Vocal style if applicable
- Specific techniques (palm muting, blast beats, tremolo picking, breakdowns, etc.)

Format: Output a clean, copy-paste ready prompt. Include a "Tags" section with comma-separated keywords and a "Negative prompt" section listing what to avoid.`;

export async function POST(req: NextRequest) {
  const {
    subgenre,
    mood,
    tempo,
    instruments,
    references,
    duration,
    target = "suno",
  } = await req.json();

  if (!subgenre) {
    return Response.json({ error: "subgenre is required" }, { status: 400 });
  }

  const userMessage = buildMusicPromptMessage({
    subgenre,
    mood,
    tempo,
    instruments,
    references,
    duration,
    target,
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: MUSIC_PROMPT_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const generatedPrompt = textBlock?.type === "text" ? textBlock.text : "";

  return Response.json({
    prompt: generatedPrompt,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
      cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
    },
  });
}

function buildMusicPromptMessage({
  subgenre,
  mood,
  tempo,
  instruments,
  references,
  duration,
  target,
}: {
  subgenre: string;
  mood?: string;
  tempo?: string;
  instruments?: string[];
  references?: string[];
  duration?: number;
  target: string;
}) {
  const parts = [
    `Create a detailed music generation prompt for **${target.toUpperCase()}** targeting a **${subgenre}** metal track.`,
  ];

  if (mood) parts.push(`Mood/atmosphere: ${mood}`);
  if (tempo) parts.push(`Tempo: ${tempo}`);
  if (instruments?.length) parts.push(`Key instruments to feature: ${instruments.join(", ")}`);
  if (references?.length) parts.push(`Sound references / influences: ${references.join(", ")}`);
  if (duration) parts.push(`Target duration: ~${duration} seconds`);

  parts.push(
    "\nInclude: genre tags, instrumentation details, production notes, tempo in BPM, key/mode, mood descriptors, and a negative prompt.",
  );

  return parts.join("\n");
}
