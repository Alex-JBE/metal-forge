export type ShareEntry = {
  id: string;
  subgenre: string;
  type: string;
  language: string;
  content: string;
  createdAt: string;
};

// Module-level singleton — survives for the lifetime of the Node.js process
const shares = new Map<string, ShareEntry>();

export function saveShare(entry: ShareEntry): void {
  shares.set(entry.id, entry);
}

export function getShare(id: string): ShareEntry | undefined {
  return shares.get(id);
}
