function getCurrentCustomer() {

    // Obtener usuario guardado
    const storedCustomer = sessionStorage.getItem('customer');

    // Si no existe sesion
    if (!storedCustomer) {
        return null;
    }
    try {
        // Convertir JSON a objeto
        return JSON.parse(storedCustomer);
    }

    catch (error) {
        // Si JSON está corrupto
        sessionStorage.removeItem('customer');
        return null;
    }
}

// Verificar si es vendedor
function isSeller(customer) {
    return customer && customer.userType === 'VENDEDOR';
}

// Configurar interfaz
function setupSessionUI() {
    // Obtener usuario
    const customer = getCurrentCustomer();

    // Boton login
    const loginButton = document.getElementById('btnIncioSesion');

    // Contenedor usuario
    const accountContainer = document.querySelector('.contentUser');

    // Boton ventas
    const sellButton = document.getElementById('btnSell');

    // Boton agregar producto
    const btnAgregarProducto = document.getElementById('btnAgregarProducto');

    //Boton Carrito
    const btnCarrito = document.getElementById('btnCarrito');
    const btnCarrito2 = document.getElementById('btnCarrito2');

    //Boton Favoritos
    const btnFavoritos = document.getElementById('btnFavorite');

    //Boton historial de compras
    const btnCompras = document.getElementById('btnCompras');

    // Contenedor menu ventas
    const sellMenuItem = sellButton ? sellButton.closest('.menu-item') : null;

    // Configurar login
    if (loginButton) {
        // Si hay sesion
        if (customer) {
            // Ocultar boton login
            loginButton.style.display = 'none';

            // Crear texto usuario
            const userLabel = document.createElement('span'
            );

            // Mostrar nombre
            userLabel.textContent =
                customer.name ||
                customer.email ||
                'Usuario';
            userLabel.id = 'usuarioActivo';

            // Agregar al header
            accountContainer.appendChild(userLabel);
        }

        else {
            // Ir login
            loginButton.addEventListener('click', function () {
                window.location.href = 'login.html';
            }
            );
        }
    }

    // Ocultar ventas si no es vendedor
    if (sellMenuItem && !isSeller(customer)) {
        sellMenuItem.style.display = 'none';
    }

    // Boton ventas
    if (sellButton) {
        sellButton.addEventListener('click',
            function () {
                window.location.href = 'ventas.html';
            }
        );
    }

    //Boton Agregar Productos
    if (btnAgregarProducto) {
        btnAgregarProducto.addEventListener('click', function () {
            window.location.href = 'agregarProducto.html';
        }
        );
    }

    //Boton Carrito
    if (btnCarrito) {
        btnCarrito.addEventListener('click', function () {
            window.location.href = "carrito.html";
        });
    }

    if (btnCarrito2) {
        btnCarrito2.addEventListener('click', function () {
            window.location.href = "carrito.html";
        });
    }

    //Boton Favorito
    if (btnFavoritos) {
        btnFavoritos.addEventListener('click', function () {
            window.location.href = "favoritos.html";
        });
    }

    //Boton historial de compras
    if (btnCompras) {
        btnCompras.addEventListener('click', function () {
            window.location.href = "mis-compras.html";
        });
    }

    const agregarProductoMenu = btnAgregarProducto ? btnAgregarProducto.closest('.menu-item') : null;

    // Ocultar si no es vendedor
    if (agregarProductoMenu && !isSeller(customer)) {
        agregarProductoMenu.style.display =
            'none';
    }
}

//Cerrar Sesion de la pagina
const btnCerraSesion = document.getElementById('btnCerraSesion');
btnCerraSesion.addEventListener('click', function () {
    sessionStorage.removeItem('customer');
    window.location.href = 'login.html';
});

// Ejecutar al cargar HTML
document.addEventListener('DOMContentLoaded', setupSessionUI);