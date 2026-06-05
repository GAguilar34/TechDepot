const API_BASE_URL = 'https://techdepotbackend-production.up.railway.app';

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options
        });

        // Si la respuesta es 201 Created o 204 No Content (éxito sin cuerpo)
        if (response.status === 201 || response.status === 204) {
            return { success: true };
        }

        // Si no hay contenido en la respuesta
        const text = await response.text();
        
        if (!text) {
            if (response.ok) {
                return { success: true };
            } else {
                throw new Error('Error en servidor: ' + response.status);
            }
        }

        // Intentar parsear JSON
        try {
            const data = JSON.parse(text);
            if (!response.ok) {
                throw new Error(data.message || 'Error en servidor');
            }
            return data;
        } catch (e) {
            if (!response.ok) {
                throw new Error('Error en servidor: ' + response.status);
            }
            return { success: true };
        }

    } catch (error) {
        console.error('Error API:', error);
        throw error;
    }
}