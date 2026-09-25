export interface ArtworkResponse {
  artwork: {
    objectId: number;
    title: string;
    artist: string | null;
    date: string | null;
    imageUrl: string;
    objectUrl: string | null;
    museum: string;
  };
  description: string;
}

