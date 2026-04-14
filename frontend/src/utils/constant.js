const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "").replace(/\/api\/v1$/, "");

const apiV1 = `${normalizedBaseUrl}/api/v1`;

export const USER_API_END_POINT = `${apiV1}/user`;
export const JOB_API_END_POINT = `${apiV1}/job`;
export const APPLICATION_API_END_POINT = `${apiV1}/application`;
export const COMPANY_API_END_POINT = `${apiV1}/company`;

export const resolveApiAssetUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `${normalizedBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};
