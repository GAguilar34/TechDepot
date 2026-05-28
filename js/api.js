const API_BASE_URL = 'https://techdepotbackend-production.up.railway.app';

// endpoint es la parte final de la URL

async function apiRequest(endpoint, options = {}) {

    try {

        // Hace la petición HTTP al servidor
        const response = await fetch(

            //Une la url y el endpoint por ejemplo en lugar de escribir toda la url ya solo es al final /customers/login
            API_BASE_URL + endpoint,

            {

                // Cabeceras de la petición
                headers: {
                    'Accept': 'application/json', //Le dice al servidor que espera recibir en formato JSON los datos
                    'Content-Type': 'application/json' //Le dice al servidor que va enviar datos en formato JSON
                },
                
                // options configuración adicional
                ...options
            }
        );

        // Convierte respuesta del servidor a objeto JavaScript
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Error en servidor'
            );

        }

        return data;

    }

    catch (error) {

        console.error(
            'Error API:',
            error
        );

        throw error;

    }

}