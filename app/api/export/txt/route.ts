import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const { content, subgenre } = await req.json();

  if (!content || !subgenre) {
    return Response.json(
      { error: "content and subgenre are required" },
      { status: 400 },
    );
  }

  const slug = subgenre.toLowerCase().replace(/[\s/]+/g, "-");
  const filename = `${slug}-${Date.now()}.txt`;
  const dir = path.join(process.cwd(), "public", "exports", "txt");

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), content, "utf-8");

  return Response.json({ filename, url: `/exports/txt/${filename}` });
}
