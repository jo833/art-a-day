import type { ArtworkResponse } from "./types";

const apiBaseUrl =
  (
    import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }
  ).env?.VITE_API_BASE_URL?.trim() || "";

/** Requests an artwork endpoint and validates the fields required by the UI. */
async function fetchArtworkFrom(endpoint: string): Promise<ArtworkResponse> {
  console.log(`Fetching artwork from ${apiBaseUrl}${endpoint}`);
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) {
    throw new Error("The artwork service could not be reached.");
  }
  const payload = (await response.json()) as ArtworkResponse;
  if (
    !payload.artwork?.imageUrl ||
    !payload.artwork.title ||
    !payload.description
  ) {
    throw new Error("The artwork service returned an invalid response.");
  }
  return payload;
}

/** Loads the current landscape artwork from the backend. */
export function fetchArtwork(): Promise<ArtworkResponse> {
  return fetchArtworkFrom("/api/artwork");
}

/** Loads a painting featuring a dog from the backend. */
export function fetchDogArtwork(): Promise<ArtworkResponse> {
  return fetchArtworkFrom("/api/dogartwork");
}
