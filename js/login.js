async function registrarse(event) {
    if (event) {
        event.preventDefault();
    }

    const accountNumber = document.getElementById('numeroCuenta').value.trim();

    const customer = {
        name: document.getElementById('nombre').value.trim(),
        email: document.getElementById('registroEmail').value.trim(),
        age: Number(document.getElementById('edad').value),
        password: document.getElementById('registroPassword').value,
        userType: document.getElementById('tipoUsuario').value,
        gender: document.getElementById('genero').value,
        phone: document.getElementById('telefono').value.trim(),
        accountNumber: accountNumber || null,
    };

    try {
        const createdCustomer = await apiRequest('/customers', { //enviamos los datos al backend en JSON
            method: 'POST',
            body: JSON.stringify(customer),
        });

        sessionStorage.setItem('customer', JSON.stringify(createdCustomer)); //Mantenemos la sesion iniciada mientra estemos en la pagina 
        alert('Cuenta creada correctamente.');
        window.location.href = 'index.html';
    } catch (error) {
        alert(error.message);
    }
}

async function iniciarSesion(event) {
    if (event) {
        event.preventDefault();
    }

    //Obtenemos los datos del login
    const credentials = {
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value,
    };

    try {
        const customer = await apiRequest('/customers/login', { //Enviamos esos datos al backend para que los valide
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        sessionStorage.setItem('customer', JSON.stringify(customer)); //Mantenemos la sesion iniciada mientra estemos en la pagina 
        alert('Inicio de sesion correcto.');
        window.location.href = 'index.html';
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('formularioRegistro').addEventListener('submit', registrarse);
document.getElementById('formularioInicioSesion').addEventListener('submit', iniciarSesion);