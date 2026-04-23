import fs from "fs";
import path from "path";
import Link from "next/link";

interface FileEntry {
  name: string;
  url: string;
  ext: "txt" | "pdf";
  sizeKb: number;
  mtime: number;
}

function getExports(): FileEntry[] {
  const files: FileEntry[] = [];
  const types = ["txt", "pdf"] as const;

  for (const ext of types) {
    const dir = path.join(process.cwd(), "public", "exports", ext);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.startsWith(".")) continue;
      const stat = fs.statSync(path.join(dir, name));
      files.push({
        name,
        url: `/exports/${ext}/${name}`,
        ext,
        sizeKb: Math.round((stat.size / 1024) * 10) / 10,
        mtime: stat.mtime.getTime(),
      });
    }
  }

  return files.sort((a, b) => b.mtime - a.mtime);
}

export default function ExportsPage() {
  const files = getExports();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-red-600">
              Saved Exports
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {files.length} file{files.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Forge
          </Link>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 text-sm">
            No exports yet. Generate some content and download it first.
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.url}
                className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`shrink-0 text-xs font-bold uppercase px-2 py-1 rounded ${
                      file.ext === "pdf"
                        ? "bg-red-900/40 text-red-500"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {file.ext}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{file.name}</p>
                    <p className="text-xs text-zinc-600">
                      {file.sizeKb} KB ·{" "}
                      {new Date(file.mtime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <a
                  href={file.url}
                  download={file.name}
                  className="shrink-0 ml-4 text-sm font-semibold text-red-600 hover:text-red-500 transition-colors"
                >
                  ↓ Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
