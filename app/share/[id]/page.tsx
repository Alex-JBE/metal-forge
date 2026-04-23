import { getShare } from "@/lib/share-store";
import { notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const entry = getShare(id);

  if (!entry) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-widest text-red-600 hover:text-red-500 transition-colors"
          >
            ⚡ METAL FORGE
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold uppercase text-red-600 tracking-wide">
              {entry.subgenre}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-sm text-zinc-500 uppercase">{entry.type}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-sm text-zinc-600 uppercase">{entry.language}</span>
          </div>
          <p className="mt-1 text-xs text-zinc-700">
            Generated {new Date(entry.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Content */}
        <div className="rounded-md border border-zinc-800 bg-zinc-900 p-6">
          <pre className="whitespace-pre-wrap text-sm text-zinc-200 font-mono leading-relaxed">
            {entry.content}
          </pre>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4 flex-wrap">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Generate your own
          </Link>
          <CopyButton
            text={entry.content}
            label="Copy text"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
