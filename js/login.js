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
        const createdCustomer = await apiRequest('/customers', {
            method: 'POST',
            body: JSON.stringify(customer),
        });

        localStorage.setItem('customer', JSON.stringify(createdCustomer));
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

    const credentials = {
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value,
    };

    try {
        const customer = await apiRequest('/customers/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        localStorage.setItem('customer', JSON.stringify(customer));
        alert('Inicio de sesion correcto.');
        window.location.href = 'index.html';
    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('formularioRegistro').addEventListener('submit', registrarse);
document.getElementById('formularioInicioSesion').addEventListener('submit', iniciarSesion);