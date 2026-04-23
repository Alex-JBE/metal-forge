import { NextRequest } from "next/server";
import { saveShare, getShare } from "@/lib/share-store";

export async function POST(req: NextRequest) {
  const { subgenre, type, language, content } = await req.json();

  if (!content || !subgenre) {
    return Response.json(
      { error: "content and subgenre are required" },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

  saveShare({
    id,
    subgenre,
    type: type ?? "lyrics",
    language: language ?? "en",
    content,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ id, url: `/share/${id}` });
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }
  const entry = getShare(id);
  if (!entry) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(entry);
}
