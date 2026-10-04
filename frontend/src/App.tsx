import { useCallback, useEffect, useState } from "react";
import { fetchArtwork, fetchDogArtwork } from "./api";
import type { ArtworkResponse } from "./types";
import "./index.css";

/** Renders the landscape home page or the dog-paintings page based on the path. */
export default function App() {
  const isDogsPage = window.location.pathname.replace(/\/+$/, "") === "/dogs";
  const [result, setResult] = useState<ArtworkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /** Loads the next artwork and exposes request errors for retry in the UI. */
  const loadArtwork = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await (isDogsPage ? fetchDogArtwork() : fetchArtwork()));
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }, [isDogsPage]);

  useEffect(() => {
    void loadArtwork();
  }, [loadArtwork]);

  return (
    <main className="page-shell">
      <header>
        <p className="eyebrow">Art a Day</p>
        <h1>
          {isDogsPage
            ? "A portrait of man's best friend."
            : "A landscape worth lingering over."}
        </h1>
        <p className="intro">
          {isDogsPage
            ? "Discover paintings of dogs from The Metropolitan Museum of Art."
            : "Discover a new work from The Metropolitan Museum of Art."}
        </p>
        <nav aria-label="Main navigation">
          {isDogsPage ? (
            <a className="nav-link" href="/">
              Back to landscapes
            </a>
          ) : (
            <a className="primary-link" href="/dogs">
              Explore dog paintings
            </a>
          )}
        </nav>
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
