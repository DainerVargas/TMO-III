const API_URL = 'http://localhost:3001/api';
export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('tmo_token');
    const headers = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
    // Only set application/json if not sending FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Algo salió mal');
    }
    return data;
};
