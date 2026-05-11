const rawApiUrl =
  import.meta.env.VITE_API_URL || "https://smart-place-nhnl.onrender.com/api";

export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://smart-place-nhnl.onrender.com";

export const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_URL || "https://smart-place-nhnl.onrender.com";

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";

  if (
    assetPath.startsWith("http://") ||
    assetPath.startsWith("https://")
  ) {
    return assetPath;
  }

  if (assetPath.startsWith("/uploads")) {
    return `${ASSET_BASE_URL}${assetPath}`;
  }

  if (assetPath.startsWith("uploads/")) {
    return `${ASSET_BASE_URL}/${assetPath}`;
  }

  return `${ASSET_BASE_URL}/uploads/${assetPath}`;
};
