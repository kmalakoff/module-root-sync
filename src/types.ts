export interface RootOptions {
  name?: string;
  keyExists?: string;
}

/** A filesystem path string or file:// URL (string or URL object) */
export type PathLike = string | URL;
