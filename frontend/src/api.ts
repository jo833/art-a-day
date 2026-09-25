import type { ArtworkResponse } from "./types";

const apiBaseUrl =
  (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL?.trim() || "";

export async function fetchArtwork(): Promise<ArtworkResponse> {
  const response = await fetch(`${apiBaseUrl}/api/artwork`);
  if (!response.ok) {
    throw new Error("The artwork service could not be reached.");
  }
  const payload = (await response.json()) as ArtworkResponse;
  if (!payload.artwork?.imageUrl || !payload.artwork.title || !payload.description) {
    throw new Error("The artwork service returned an invalid response.");
  }
  return payload;
}

