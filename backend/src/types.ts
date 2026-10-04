/** Artwork fields consumed when selecting objects from The Met Collection API. */
export interface MetArtwork {
  objectID: number;
  title: string;
  artistDisplayName?: string;
  objectDate?: string;
  primaryImage?: string;
  primaryImageSmall?: string;
  objectURL?: string;
  classification?: string;
  objectName?: string;
  medium?: string;
  isPublicDomain?: boolean;
  tags?: Array<{ term: string }>;
}

/** Stable response shape shared by the landscape and dog-artwork endpoints. */
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
