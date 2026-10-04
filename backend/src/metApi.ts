import { config } from "./config.js";
import type { MetArtwork } from "./types.js";

const landscapeTerms = [
  "landscape",
  "scenery",
  "view",
  "mountain",
  "river",
  "forest",
  "coast",
];
const dogTerms = ["dog", "dogs", "puppy", "puppies", "canine", "hound"];

/** Fetches JSON from The Met and aborts requests that exceed the configured timeout. */
async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    config.upstreamTimeoutMs,
  );
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

/** Checks searchable artwork metadata for terms associated with landscapes. */
function isLandscape(artwork: MetArtwork): boolean {
  const searchable = [
    artwork.title,
    artwork.classification ?? "",
    artwork.objectName ?? "",
    artwork.medium ?? "",
    ...(artwork.tags ?? []).map((tag) => tag.term),
  ]
    .join(" ")
    .toLowerCase();
  return landscapeTerms.some((term) => searchable.includes(term));
}

/** Requires both a painting classification and dog-related searchable metadata. */
function isDogPainting(artwork: MetArtwork): boolean {
  const searchable = [
    artwork.title,
    artwork.classification ?? "",
    artwork.objectName ?? "",
    artwork.medium ?? "",
    ...(artwork.tags ?? []).map((tag) => tag.term),
  ]
    .join(" ")
    .toLowerCase();

  return dogTerms.some((term) => searchable.includes(term));
}

/** Selects a random image-bearing landscape from a bounded set of Met results. */
export async function getRandomLandscape(): Promise<MetArtwork> {
  const search = await fetchJson<{ objectIDs?: number[] }>(
    `${config.metApiBaseSearchUrl}/search?hasImages=true&q="landscapes"&medium=Paintings`,
  );
  const ids = [...(search.objectIDs ?? [])]
    .sort(() => Math.random() - 0.5)
    .slice(0, config.maxCandidates);
  for (const id of ids) {
    const artwork = await fetchJson<MetArtwork>(
      `${config.metApiBaseUrl}/objects/${id}`,
    );
    if (
      artwork.isPublicDomain &&
      (artwork.primaryImage || artwork.primaryImageSmall) &&
      isLandscape(artwork)
    ) {
      return artwork;
    }
  }
  throw new Error("No eligible landscape artwork was found.");
}

/** Selects a random image-bearing painting about dogs from Met search results. */
export async function getRandomDogArtwork(): Promise<MetArtwork> {
  const search = await fetchJson<{ objectIDs?: number[] }>(
    `${config.metApiBaseSearchUrl}/search?hasImages=true&q=dog&medium=Paintings`,
  );
  const ids = [...(search.objectIDs ?? [])]
    .sort(() => Math.random() - 0.5)
    .slice(0, config.maxCandidates);
  for (const id of ids) {
    const artwork = await fetchJson<MetArtwork>(
      `${config.metApiBaseUrl}/objects/${id}`,
    );
    if (
      artwork.isPublicDomain &&
      (artwork.primaryImage || artwork.primaryImageSmall) &&
      isDogPainting(artwork)
    ) {
      return artwork;
    }
  }
  throw new Error("No eligible dog painting artwork was found.");
}
