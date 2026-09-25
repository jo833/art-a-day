import express, { type ErrorRequestHandler } from "express";
import { config } from "./config.js";
import { getRandomLandscape } from "./metApi.js";
import type { ArtworkResponse } from "./types.js";

export const app = express();
const allowedOrigins = new Set([
  config.frontendOrigin,
  config.frontendOrigin,
  config.backendOrigin,
]);

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

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/artwork", async (_request, response, next) => {
  try {
    const artwork = await getRandomLandscape();
    const metadata = [
      artwork.artistDisplayName && `by ${artwork.artistDisplayName}`,
      artwork.objectDate && `dated ${artwork.objectDate}`,
      artwork.medium && `in ${artwork.medium}`,
    ].filter(Boolean);
    const description = `${artwork.title}${metadata.length ? ` (${metadata.join(", ")})` : ""}.`;
    const payload: ArtworkResponse = {
      artwork: {
        objectId: artwork.objectID,
        title: artwork.title,
        artist: artwork.artistDisplayName || null,
        date: artwork.objectDate || null,
        imageUrl: artwork.primaryImage || artwork.primaryImageSmall,
        objectUrl: artwork.objectURL || null,
        museum: "The Metropolitan Museum of Art",
      },
      description,
    };
    response.json(payload);
  } catch (error) {
    next(error);
  }
});

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
