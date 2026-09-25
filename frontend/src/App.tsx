import { useCallback, useEffect, useState } from "react";
import { fetchArtwork } from "./api";
import type { ArtworkResponse } from "./types";
import "./index.css";

export default function App() {
  const [result, setResult] = useState<ArtworkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadArtwork = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await fetchArtwork());
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArtwork();
  }, [loadArtwork]);

  return (
    <main className="page-shell">
      <header>
        <p className="eyebrow">Art a Day</p>
        <h1>A landscape worth lingering over.</h1>
        <p className="intro">
          Discover a new work from The Metropolitan Museum of Art.
        </p>
      </header>
      {loading && <p role="status">Finding an artwork...</p>}
      {error && (
        <section className="message" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void loadArtwork()}>
            Try again
          </button>
        </section>
      )}
      {result && !loading && (
        <article className="artwork-card">
          <img src={result.artwork.imageUrl} alt={result.artwork.title} />
          <div className="artwork-details">
            <p className="eyebrow">{result.artwork.museum}</p>
            <h2>{result.artwork.title}</h2>
            <p className="metadata">
              {result.artwork.artist ?? "Artist unknown"}
              {result.artwork.date ? ` · ${result.artwork.date}` : ""}
            </p>
            <p>{result.description}</p>
            {result.artwork.objectUrl && (
              <a
                href={result.artwork.objectUrl}
                target="_blank"
                rel="noreferrer"
              >
                View the work at The Met
              </a>
            )}
            <button type="button" onClick={() => void loadArtwork()}>
              Show another
            </button>
          </div>
        </article>
      )}
    </main>
  );
}
