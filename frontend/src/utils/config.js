const rawApiUrl =
  import.meta.env.VITE_API_URL || "https://smart-place-nhnl.onrender.com/api";

export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://smart-place-nhnl.onrender.com";

export const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_URL || "https://smart-place-nhnl.onrender.com";

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${ASSET_BASE_URL}${assetPath}`;
};
