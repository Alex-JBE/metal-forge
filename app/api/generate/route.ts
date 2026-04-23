import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const METAL_SYSTEM_PROMPT = `You are an expert metal music content creator with deep knowledge of all metal subgenres — from classic heavy metal and thrash to black metal, doom, death metal, metalcore, deathcore, djent, progressive metal, and beyond.

You craft authentic, genre-appropriate content that captures the exact atmosphere, lyrical themes, and stylistic nuances of each subgenre. Your writing is evocative, powerful, and true to metal culture.

Guidelines by content type:
- LYRICS: Follow traditional verse/chorus/bridge structure unless otherwise specified. Use genre-appropriate imagery — darkness, war, mythology, nature, existentialism, horror, politics, or philosophy depending on subgenre.
- BIO: Write in third person, emphasize the band's sound, influences, and ethos. Make it sound like a press bio.
- PRESS_RELEASE: Formal tone announcing new music, tours, or milestones.
- CONCEPT: Elaborate on a thematic idea or album concept with depth and lore.`;

export async function POST(req: NextRequest) {
  const { subgenre, type = "lyrics", prompt, language = "en" } = await req.json();

  if (!subgenre) {
    return Response.json({ error: "subgenre is required" }, { status: 400 });
  }

  const userMessage = buildUserMessage({ subgenre, type, prompt, language });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: METAL_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
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
