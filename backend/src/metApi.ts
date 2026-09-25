import { config } from "./config.js";
import type { MetArtwork } from "./types.js";

const landscapeTerms = ["landscape", "scenery", "view", "mountain", "river", "forest", "coast"];

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.upstreamTimeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`The Met API returned ${response.status}.`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function isLandscape(artwork: MetArtwork): boolean {
  const searchable = [
    artwork.title,
    artwork.classification,
    artwork.objectName,
    artwork.medium,
    ...(artwork.tags ?? []).map((tag) => tag.term),
  ]
    .join(" ")
    .toLowerCase();
  return landscapeTerms.some((term) => searchable.includes(term));
}

export async function getRandomLandscape(): Promise<MetArtwork> {
  const search = await fetchJson<{ objectIDs?: number[] }>(
    `${config.metApiBaseUrl}/search?hasImages=true&q=landscape`,
  );
  const ids = [...(search.objectIDs ?? [])].sort(() => Math.random() - 0.5).slice(0, config.maxCandidates);
  for (const id of ids) {
    const artwork = await fetchJson<MetArtwork>(`${config.metApiBaseUrl}/objects/${id}`);
    if (artwork.primaryImage && isLandscape(artwork)) {
      return artwork;
    }
  }
  throw new Error("No eligible landscape artwork was found.");
}

