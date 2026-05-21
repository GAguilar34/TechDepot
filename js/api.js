const API_BASE_URL = 'https://techdepotbackend-production.up.railway.app';

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        throw new Error(typeof data === 'string' ? data : 'Ocurrio un error en la peticion.');
    }

    return data;
}