async function verificarSesion(){

    // Obtener datos guardados
    const customer = JSON.parse(
        sessionStorage.getItem(
            'customer'
        )
    );

    console.log(customer);

    if(!customer){

        window.location.href =
        'login.html';

        return;
    }

    try{

        console.log(customer.id);

        // Verificar en backend
        await apiRequest(
            '/customers/' + customer.id
        );

        console.log(
            'Sesión válida'
        );

    }

    catch(error){

        console.log(error);

        // Si usuario ya no existe
        sessionStorage.removeItem(
            'customer'
        );

        window.location.href =
        'login.html';

    }

}

function cerrarSesion(){

    sessionStorage.removeItem(
        'customer'
    );

    window.location.href =
    'login.html';

}