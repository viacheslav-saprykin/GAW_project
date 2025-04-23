// src/types/index.ts
export type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  genres?: string[];
};
