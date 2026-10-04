import express, {
  type ErrorRequestHandler,
  type NextFunction,
  type Response,
} from "express";
import { config } from "./config.js";
import { getRandomDogArtwork, getRandomLandscape } from "./metApi.js";
import type { ArtworkResponse } from "./types.js";

export const app = express();
const allowedOrigins = new Set([
  config.frontendOrigin,
  config.frontendOrigin,
  config.backendOrigin,
]);

// Allow requests from the configured frontend and answer browser preflight checks.
app.use((request, response, next) => {
  const origin = request.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  if (request.method === "OPTIONS") {
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json());

// Reports whether the API process is responding.
app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

/** Converts a selected Met object into the API's shared artwork response. */
async function sendArtwork(
  getArtwork: typeof getRandomLandscape,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const artwork = await getArtwork();
    const metadata = [
      artwork.artistDisplayName && `by ${artwork.artistDisplayName}`,
      artwork.objectDate && `dated ${artwork.objectDate}`,
      artwork.medium && `in ${artwork.medium}`,
    ].filter(Boolean);
    const description = `${artwork.title}${metadata.length ? ` (${metadata.join(", ")})` : ""}.`;
    const imageUrl = artwork.primaryImage || artwork.primaryImageSmall;
    if (!imageUrl) {
      throw new Error("The artwork has no available image.");
    }
    const payload: ArtworkResponse = {
      artwork: {
        objectID: artwork.objectID,
        title: artwork.title,
        artist: artwork.artistDisplayName || null,
        date: artwork.objectDate || null,
        imageUrl,
        objectUrl: artwork.objectURL || null,
        museum: "The Metropolitan Museum of Art",
      },
      description,
    };
    response.json(payload);
  } catch (error) {
    next(error);
  }
}

// Both artwork routes share the same response shaping and error-handling path.
app.get("/api/artwork", (_request, response, next) => {
  void sendArtwork(getRandomLandscape, response, next);
});

app.get("/api/dogartwork", (_request, response, next) => {
  void sendArtwork(getRandomDogArtwork, response, next);
});

/** Logs upstream failures and returns a stable error response to API clients. */
const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error(
    "Artwork request failed:",
    error instanceof Error ? error.message : error,
  );
  response.status(502).json({ error: "Unable to retrieve artwork right now." });
};

app.use(errorHandler);
