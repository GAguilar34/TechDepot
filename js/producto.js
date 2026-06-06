// Obtener ID del producto de la URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Variable para la imagen actual
let imagenActual = 0;

// Cargar detalle del producto
async function cargarProductoDetalle() {
    const productId = getProductId();
    const contenedor = document.getElementById('productoDetalle');

    if (!productId) {
        contenedor.innerHTML = '<p class="error-message">❌ Producto no encontrado</p>';
        return;
    }

    contenedor.innerHTML = '<p class="loading">⚡ Cargando producto...</p>';

    try {
        const producto = await apiRequest('/products/' + productId);
        console.log('📦 Producto cargado:', producto);
        mostrarProductoDetalle(producto);
    } catch (error) {
        console.error('Error:', error);
        contenedor.innerHTML = `
            <div class="error-message">
                <p>Error al cargar el producto</p>
                <button onclick="cargarProductoDetalle()" class="btn-regresar" style="margin-top:10px;">🔄 Reintentar</button>
            </div>
        `;
    }
}

// Mostrar producto en detalle
function mostrarProductoDetalle(producto) {
    const contenedor = document.getElementById('productoDetalle');

    // Asegurar que haya imágenes (el backend a veces manda imageUrl singular)
    let imagenes;
    if (producto.imageUrls && producto.imageUrls.length > 0) {
        imagenes = producto.imageUrls;
    } else if (producto.imageUrl) {
        imagenes = [producto.imageUrl];
    } else {
        imagenes = ['images/logo.png'];
    }

    contenedor.innerHTML = `
        <button onclick="window.location.href='index.html'" class="btn-regresar">← Volver a productos</button>
        
        <div class="producto-detalle-grid">
            <!-- Galería de imágenes -->
            <div class="galeria-imagenes">
                <div class="imagen-principal ${imagenes.length === 1 ? 'imagen-unica' : ''}" id="imagenPrincipal">
                    <img src="${imagenes[0]}" alt="${producto.nameProduct}" 
                         onerror="this.src='images/logo.png'">
                </div>
                <div class="miniaturas" id="miniaturas">
                    ${imagenes.length > 1 ? imagenes.map((img, index) => `
                        <div class="miniatura ${index === 0 ? 'active' : ''}" 
                             onclick="cambiarImagen(${index}, '${img.replace(/'/g, "\\'")}')">
                            <img src="${img}" alt="Imagen ${index + 1}" 
                                 onerror="this.src='images/logo.png'">
                        </div>
                    `).join('') : ''}
                </div>
            </div>

            <!-- Información del producto -->
            <div class="info-producto">
                <span class="badge-estado ${producto.state === 'Nuevo' ? 'badge-nuevo' : 'badge-usado'}">
                    ${producto.state}
                </span>
                
                <h1>${producto.nameProduct}</h1>
                
                <p class="categoria-tag">📦 ${producto.category}</p>
                
                <p class="precio-grande">$${producto.price.toFixed(2)}</p>
                
                <p class="${producto.amount > 0 ? 'stock-disponible' : 'stock-agotado'}">
                    ${producto.amount > 0
                        ? `✅ ${producto.amount} unidades disponibles`
                        : '❌ Producto agotado'}
                </p>

                <div class="descripcion-producto">
                    <h3>📝 Descripción</h3>
                    <p>${producto.description}</p>
                </div>

                <div class="botones-accion">
                    <button class="btn-agregar-carrito" 
                            onclick="agregarAlCarrito(${producto.id})"
                            ${producto.amount === 0 ? 'disabled' : ''}>
                        ${producto.amount > 0 ? '🛒 Agregar al Carrito' : '🚫 Agotado'}
                    </button>
                    <button class="btn-favorito-detalle" onclick="agregarAFavoritos(${producto.id})">
                        ♡ Favorito
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Cambiar imagen principal
function cambiarImagen(index, url) {
    imagenActual = index;

    // Actualizar imagen principal
    document.querySelector('#imagenPrincipal img').src = url;

    // Actualizar miniatura activa
    document.querySelectorAll('.miniatura').forEach((mini, i) => {
        mini.classList.toggle('active', i === index);
    });
}

// Agregar al carrito
function agregarAlCarrito(productId) {
    const customer = JSON.parse(sessionStorage.getItem('customer'));
    if (!customer) {
        alert('Debes iniciar sesión para agregar al carrito.');
        window.location.href = 'login.html';
        return;
    }

    // Obtener datos del producto actual
    const nombre = document.querySelector('.info-producto h1').textContent;
    const precio = document.querySelector('.precio-grande').textContent;
    const imagen = document.querySelector('#imagenPrincipal img').src;

    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

    // Verificar si ya existe
    const existe = carrito.find(p => p.id === productId);
    if (existe) {
        existe.cantidad = (existe.cantidad || 1) + 1;
    } else {
        carrito.push({
            id: productId,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }

    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito!');
}

// Agregar a favoritos
function agregarAFavoritos(productId) {
    const customer = JSON.parse(sessionStorage.getItem('customer'));
    if (!customer) {
        alert('Debes iniciar sesión para agregar a favoritos.');
        window.location.href = 'login.html';
        return;
    }

    let favoritos = JSON.parse(sessionStorage.getItem('favoritos')) || [];

    if (!favoritos.includes(productId)) {
        favoritos.push(productId);
        sessionStorage.setItem('favoritos', JSON.stringify(favoritos));
        alert('Producto agregado a favoritos!');
    } else {
        alert('Este producto ya está en tus favoritos.');
    }
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProductoDetalle();
});