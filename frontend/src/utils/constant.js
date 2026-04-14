const isDev = import.meta.env.DEV;

// In local development we intentionally default to relative API paths so Vite proxy handles routing.
// Use VITE_API_BASE_URL only for deployed environments (or explicitly set VITE_API_BASE_URL_DEV).
const rawBaseUrl = isDev
    ? import.meta.env.VITE_API_BASE_URL_DEV || ""
    : import.meta.env.VITE_API_BASE_URL || "";

const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
const apiV1 = normalizedBaseUrl ? `${normalizedBaseUrl}/api/v1` : "/api/v1";

export const USER_API_END_POINT = `${apiV1}/user`;
export const JOB_API_END_POINT = `${apiV1}/job`;
export const APPLICATION_API_END_POINT = `${apiV1}/application`;
export const COMPANY_API_END_POINT = `${apiV1}/company`;
