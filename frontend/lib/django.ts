const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001/api";

// LocalStorage helpers for JWT Token
export const setTokens = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
};

export const getAccessToken = () => localStorage.getItem("access_token");

export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// Generic Fetch Wrapper
export async function djangoFetch(endpoint: string, options: RequestInit = {}) {
    const token = getAccessToken();
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    const isAuthEndpoint = endpoint.includes("/accounts/register/") || endpoint.includes("/accounts/login/");
    if (token && !isAuthEndpoint) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        // Agar token expire ho gaya ho, toh storage saaf kar do
        if (response.status === 401 && data?.code === "token_not_valid") {
            logout();
        }
        return { data: null, error: data || response.statusText };
    }
    return { data, error: null };
}