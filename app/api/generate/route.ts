import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const METAL_SYSTEM_PROMPT = fs.readFileSync(
  path.join(process.cwd(), "lib", "skill.md"),
  "utf-8",
);

export async function POST(req: NextRequest) {
  const { subgenre, type = "lyrics", prompt, language = "en" } = await req.json();

  if (!subgenre) {
    return Response.json({ error: "subgenre is required" }, { status: 400 });
  }

  const userMessage = buildUserMessage({ subgenre, type, prompt, language });

  const LANG_INSTRUCTIONS: Record<string, string> = {
    de: "Generiere alle Inhalte auf Deutsch. Verwende authentische deutsche Metallsprache mit korrekter Grammatik und passender stilistischer Intensität.",
    ru: "Генерируй весь контент на русском языке. Используй аутентичный русский металлический стиль с правильной грамматикой, падежами и богатой образностью.",
  };

  const systemBlocks: Anthropic.Messages.TextBlockParam[] = [
    {
      type: "text",
      text: METAL_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ];

  if (language !== "en" && LANG_INSTRUCTIONS[language]) {
    systemBlocks.push({ type: "text", text: LANG_INSTRUCTIONS[language] });
  }

  systemBlocks.push({
    type: "text",
    text: `After completing the main content, append the following section on a new line — no extra commentary, no markdown, exactly this format:

[MUSIC_PROMPT]
<one paragraph of real music production tags for Suno/Udio: BPM, tempo descriptor, tuning, key instruments, guitar tone, drum style, vocal style, atmosphere, mood, sonic influences, production style. Write as comma-separated descriptors, not sentences.>`,
  });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    system: systemBlocks,
    messages: [{ role: "user", content: userMessage }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function buildUserMessage({
  subgenre,
  type,
  prompt,
  language,
}: {
  subgenre: string;
  type: string;
  prompt?: string;
  language: string;
}) {
  const typeLabel = type.toUpperCase().replace(/_/g, " ");
  const langNote = language !== "en" ? ` Write in ${language}.` : "";

  const base = `Generate ${typeLabel} for a ${subgenre} metal act.${langNote}`;

  if (prompt) {
    return `${base}\n\nTheme / direction: ${prompt}`;
  }

  const defaults: Record<string, string> = {
    lyrics: `${base}\n\nWrite a full song with verse, pre-chorus, chorus, and bridge. Include section labels.`,
    bio: `${base}\n\nWrite a 150–200 word band biography suitable for a press kit or music platform.`,
    press_release: `${base}\n\nWrite a press release announcing a new album. Include a fictional album name, release date, and quotes from the band.`,
    concept: `${base}\n\nDevelop a rich album concept — themes, narrative arc, and track-by-track summary (5–7 tracks).`,
  };

  return defaults[type] ?? base;
}
