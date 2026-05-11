export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
export const ASSET_BASE_URL = import.meta.env.VITE_ASSET_URL;

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${ASSET_BASE_URL || ""}${assetPath}`;
};
