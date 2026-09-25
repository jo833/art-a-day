export interface MetArtwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  primaryImage: string;
  primaryImageSmall: string;
  objectURL: string;
  classification: string;
  objectName: string;
  medium: string;
  tags?: Array<{ term: string }>;
}

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

