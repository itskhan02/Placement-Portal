export const API_BASE_URL = (() => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    envUrl = envUrl.replace(/\/$/, "");
    return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
  }
  return import.meta.env.PROD ? "/api" : "http://localhost:8000/api";
})();

export const SOCKET_URL = (() => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  return import.meta.env.PROD ? "/" : "http://localhost:8000";
})();

export const ASSET_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_ASSET_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  return import.meta.env.PROD ? "" : "http://localhost:8000";
})();

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return "";

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  return `${ASSET_BASE_URL}${assetPath}`;
};
