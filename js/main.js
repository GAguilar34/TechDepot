//Obtenemos el cliente y guardamos sus datos de forma temporal
function getCurrentCustomer() {
    const storedCustomer = sessionStorage.getItem('customer');
    if (!storedCustomer) return null;
    try {
        return JSON.parse(storedCustomer);
    } catch {
        sessionStorage.removeItem('customer');
        return null;
    }
}

//Verificamos si es un vendedor o cliente
function isSeller(customer) {
    return customer && customer.userType === 'VENDEDOR';
}

//
function setupSessionUI() {
    const customer = getCurrentCustomer();
    const loginButton = document.getElementById('btnIncioSesion');
    const accountContainer = document.querySelector('.contentUser');
    const cuentaImg = document.getElementById('cuenta');

    // Mostrar email o botón login
    if (accountContainer) {
        if (customer) {
            if (loginButton) loginButton.style.display = 'none';
            
            if (!document.getElementById('usuarioActivo')) {
                const userLabel = document.createElement('span');
                userLabel.textContent = customer.email || customer.name || 'Usuario';
                userLabel.id = 'usuarioActivo';
                if (cuentaImg) {
                    cuentaImg.insertAdjacentElement('afterend', userLabel);
                } else {
                    accountContainer.appendChild(userLabel);
                }
            }
        } else {
            if (loginButton) {
                loginButton.style.display = 'block';
                loginButton.onclick = () => window.location.href = 'login.html';
            }
        }
    }

    // Configurar navegación
    setupNavigation(customer);
}

function setupNavigation(customer) {
    const navegacion = {
        'home': 'index.html',
        'btnCarrito': 'carrito.html',
        'btnCarrito2': 'carrito.html',
        'btnSell': 'ventas.html',
        'btnFavorite': 'favoritos.html',
        'btnCompras': 'mis-compras.html',
        'btnAgregarProducto': 'agregarProducto.html'
    };

    // Configurar botones de navegación
    Object.entries(navegacion).forEach(([id, url]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = () => window.location.href = url;
        }
    });

    // Cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerraSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.onclick = () => {
            sessionStorage.removeItem('customer');
            window.location.href = 'login.html';
        };
    }

    // Ocultar opciones de vendedor si no lo es
    if (!isSeller(customer)) {
        const sellMenuItem = document.getElementById('btnSell')?.closest('.menu-item');
        const agregarMenu = document.getElementById('btnAgregarProducto')?.closest('.menu-item');
        if (sellMenuItem) sellMenuItem.style.display = 'none';
        if (agregarMenu) agregarMenu.style.display = 'none';
    }
}

//Productos
let todosLosProductos = [];

//Cargamos los producyos
async function cargarProductos() {
    const contenedor = document.getElementById('productosGrid');
    if (!contenedor) return;

    //Mostramos en nuestra pagina que estan cargando los productos 
    contenedor.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;">⚡ Cargando productos...</p>';

    try {
        //Obtenemos los productos de la base de datos mediante el backend
        const productos = await apiRequest('/products');
        console.log('Productos recibidos:', productos);
        todosLosProductos = productos || [];

        if (todosLosProductos.length === 0) {
            contenedor.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;">📭 No hay productos disponibles.</p>';
            return;
        }
        //Enviamos los productos obtenidos a la funcion mostrarProductos
        mostrarProductos(todosLosProductos);
    } catch (error) {
        console.error('Error:', error);
        contenedor.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;">
                <p>Error al cargar productos</p>
                <button onclick="cargarProductos()" style="padding:8px 16px;background:#1E3A8A;color:white;border:none;border-radius:6px;cursor:pointer;">Reintentar</button>
            </div>`;
    }
}

//Cargamos los productos en nuestro index de nuestra pagina
function mostrarProductos(productos) {
    const contenedor = document.getElementById('productosGrid');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const imagenUrl = (producto.imageUrls && producto.imageUrls.length > 0)
            ? producto.imageUrls[0]
            : (producto.imageUrl || 'images/logo.png');

        const card = document.createElement('div');
        card.className = 'producto-card';
        card.style.cursor = 'pointer';
        
        // Hacer toda la card clickeable
        card.addEventListener('click', (e) => {
            // Evitar que se active al hacer clic en los botones
            if (e.target.tagName === 'BUTTON') return;
            window.location.href = 'producto.html?id=' + producto.id;
        });
        
        card.innerHTML = `
            <div style="position:relative;background:#f9f9f9;">
                <img src="${imagenUrl}" alt="${producto.nameProduct}" 
                     onerror="this.src='images/logo.png'" loading="lazy"
                     style="width:100%;height:150px;object-fit:contain;padding:10px;">
                <span style="position:absolute;top:10px;right:10px;background:${producto.state==='Nuevo'?'#10B981':'#F59E0B'};color:white;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold;">
                    ${producto.state}
                </span>
            </div>
            <div class="card-info">
                <h3>${producto.nameProduct}</h3>
                <p class="card-categoria">📦 ${producto.category}</p>
                <p class="card-precio">$${producto.price.toFixed(2)}</p>
                <p style="font-size:12px;color:${producto.amount>0?'#10B981':'#EF4444'};margin:4px 0;">
                    ${producto.amount>0?`✅ ${producto.amount} en stock`:'❌ Agotado'}
                </p>
            </div>
            <div class="card-botones">
                <button class="btn-comprar" onclick="event.stopPropagation(); window.location.href='producto.html?id=${producto.id}'">
                    🛒 Ver Producto
                </button>
                <button class="btn-favorito" onclick="event.stopPropagation(); agregarFavorito(${producto.id})">
                    ♡ Favorito
                </button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function filtrarCategoria(categoria) {
    if (!categoria) {
        mostrarProductos(todosLosProductos);
    } else {
        const filtrados = todosLosProductos.filter(p => p.category === categoria);
        if (filtrados.length === 0) {
            document.getElementById('productosGrid').innerHTML = 
                '<p style="grid-column:1/-1;text-align:center;padding:40px;">📭 No hay productos en esta categoría.</p>';
        } else {
            mostrarProductos(filtrados);
        }
    }
}

function agregarFavorito(id) {
    const customer = getCurrentCustomer();
    if (!customer) {
        alert('Debes iniciar sesión para agregar a favoritos.');
        window.location.href = 'login.html';
        return;
    }
    alert('Producto agregado a favoritos.');
}

// Configurar filtros
function setupFiltros() {
    const filtrosContainer = document.getElementById('filtrosCategorias');
    if (!filtrosContainer) return;

    filtrosContainer.innerHTML = '';

    const categorias = [
        { valor: null, nombre: 'Todos' },
        { valor: 'PROCESADOR', nombre: 'Procesadores' },
        { valor: 'TARJETA DE VIDEO', nombre: 'Tarjetas Video' },
        { valor: 'MEMORIA RAM', nombre: 'RAM' },
        { valor: 'MEMORIA ROM', nombre: 'Almacenamiento' },
        { valor: 'GABINETE', nombre: 'Gabinetes' },
        { valor: 'FUENTE DE PODER', nombre: 'Fuentes Poder' },
        { valor: 'MOTHERBOARD', nombre: 'Motherboards' },
        { valor: 'REFRIGERACION', nombre: 'Refrigeración' },
        { valor: 'PERIFERICOS', nombre: 'Periféricos' }
    ];

    categorias.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.textContent = cat.nombre;
        
        if (index === 0) btn.classList.add('active');

        btn.addEventListener('click', () => {
            filtrosContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtrarCategoria(cat.valor);
        });

        filtrosContainer.appendChild(btn);
    });
}

// Búsqueda
function setupBusqueda() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        if (termino === '') {
            mostrarProductos(todosLosProductos);
        } else {
            const filtrados = todosLosProductos.filter(p => 
                p.nameProduct.toLowerCase().includes(termino) ||
                p.description.toLowerCase().includes(termino) ||
                p.category.toLowerCase().includes(termino)
            );
            mostrarProductos(filtrados);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 TechDepot iniciado');
    setupSessionUI();
    setupFiltros();
    setupBusqueda();
    cargarProductos();
});