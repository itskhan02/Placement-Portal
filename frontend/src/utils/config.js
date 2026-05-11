export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:8000/api");
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? "/" : "http://localhost:8000");
export const ASSET_BASE_URL = import.meta.env.VITE_ASSET_URL || (import.meta.env.PROD ? "" : "http://localhost:8000");

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${ASSET_BASE_URL || ""}${assetPath}`;
};
