/** Artwork payload returned by the backend and rendered by the frontend. */
export interface ArtworkResponse {
  artwork: {
    objectID: number;
    title: string;
    artist: string | null;
    date: string | null;
    imageUrl: string;
    objectUrl: string | null;
    museum: string;
  };
  description: string;
}
