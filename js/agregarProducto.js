const MAX_IMAGENES = 20;
let archivosSeleccionados = [];

const dropZone = document.getElementById('dropZone');
const inputImagenes = document.getElementById('inputImagenes');
const previews = document.getElementById('previews');
const contador = document.getElementById('contadorImagenes');

// Verificar sesión
(function verificarSesion() {
    const customer = sessionStorage.getItem('customer');
    if (!customer) {
        window.location.href = 'login.html';
        return;
    }
    const customerData = JSON.parse(customer);
    if (customerData.userType !== 'VENDEDOR') {
        alert('Solo los vendedores pueden agregar productos.');
        window.location.href = 'index.html';
    }
})();

// Drag & Drop
dropZone.addEventListener('click', () => inputImagenes.click());

inputImagenes.addEventListener('change', (e) => {
    agregarArchivos(Array.from(e.target.files));
    inputImagenes.value = '';
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const archivos = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    agregarArchivos(archivos);
});

function agregarArchivos(nuevos) {
    const disponibles = MAX_IMAGENES - archivosSeleccionados.length;
    if (disponibles <= 0) {
        alert('Ya alcanzaste el límite de 20 imágenes.');
        return;
    }
    const aAgregar = nuevos.slice(0, disponibles);
    archivosSeleccionados.push(...aAgregar);
    renderPreviews();
}

function renderPreviews() {
    previews.innerHTML = '';
    contador.textContent = `${archivosSeleccionados.length} / ${MAX_IMAGENES} imágenes`;
    archivosSeleccionados.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button type="button" onclick="eliminarImagen(${index})">×</button>
            `;
            previews.appendChild(item);
        };
        reader.readAsDataURL(file);
    });
}

function eliminarImagen(index) {
    archivosSeleccionados.splice(index, 1);
    renderPreviews();
}

// Validar formulario
function validarFormulario() {
    const nombre = document.getElementById('nombreProducto').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const estado = document.querySelector('input[name="estado"]:checked');

    // Validar nombre
    if (!nombre) {
        mostrarError('El nombre del producto es obligatorio.');
        return false;
    }
    if (nombre.length < 4) {
        mostrarError('El nombre debe tener al menos 4 caracteres.');
        return false;
    }

    // Validar descripción
    if (!descripcion) {
        mostrarError('La descripción es obligatoria.');
        return false;
    }
    if (descripcion.length < 10) {
        mostrarError(`La descripción debe tener al menos 10 caracteres. Te faltan ${10 - descripcion.length} caracteres.`);
        return false;
    }
    if (descripcion.length < 100) {
        mostrarError(`La descripción debe tener al menos 100 caracteres. Te faltan ${100 - descripcion.length} caracteres.`);
        return false;
    }

    // Validar precio
    if (!precio || Number(precio) <= 0) {
        mostrarError('El precio debe ser mayor a $0.');
        return false;
    }

    // Validar cantidad
    if (!cantidad || Number(cantidad) <= 0) {
        mostrarError('La cantidad debe ser mayor a 0.');
        return false;
    }

    // Validar categoría
    if (!categoria) {
        mostrarError('Debes seleccionar una categoría.');
        return false;
    }

    // Validar estado
    if (!estado) {
        mostrarError('Debes seleccionar el estado del producto.');
        return false;
    }

    // Validar imágenes
    if (archivosSeleccionados.length === 0) {
        mostrarError('Debes agregar al menos una imagen del producto.');
        return false;
    }

    return true;
}

// Mostrar error de forma amigable
function mostrarError(mensaje) {
    // Crear o actualizar el mensaje de error
    let errorDiv = document.getElementById('mensajeError');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'mensajeError';
        errorDiv.style.cssText = `
            background: #FEE2E2;
            color: #991B1B;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 10px 0;
            border: 1px solid #FCA5A5;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            text-align: center;
        `;
        const form = document.getElementById('formProduct');
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    errorDiv.textContent = '⚠️ ' + mensaje;
    errorDiv.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
    
    // Hacer scroll al mensaje
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Mostrar contador de caracteres en tiempo real
function setupContadorCaracteres() {
    const descripcion = document.getElementById('descripcion');
    if (!descripcion) return;
    
    // Crear contador
    const contador = document.createElement('small');
    contador.id = 'contadorDescripcion';
    contador.style.cssText = `
        display: block;
        text-align: right;
        margin-top: 5px;
        font-size: 12px;
    `;
    descripcion.parentNode.appendChild(contador);
    
    // Actualizar contador
    function actualizarContador() {
        const longitud = descripcion.value.length;
        contador.textContent = `${longitud}/100 caracteres`;
        
        if (longitud < 100) {
            contador.style.color = '#EF4444';
        } else {
            contador.style.color = '#10B981';
        }
    }
    
    descripcion.addEventListener('input', actualizarContador);
    actualizarContador();
}

// Enviar formulario
document.getElementById('formProduct').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Validar antes de enviar
    if (!validarFormulario()) return;

    const nombre = document.getElementById('nombreProducto').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const cantidad = Number(document.getElementById('cantidad').value);
    const precio = Number(document.getElementById('precio').value);
    const categoria = document.getElementById('categoria').value;
    const estado = document.querySelector('input[name="estado"]:checked').value;

    const btn = document.getElementById('btnAgregar');
    const textoOriginal = btn.textContent;
    btn.textContent = 'Subiendo imágenes...';
    btn.disabled = true;

    try {
        // Subir imágenes
        const formData = new FormData();
        archivosSeleccionados.forEach(file => formData.append('files', file));

        const uploadRes = await fetch(API_BASE_URL + '/api/images/upload', {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) throw new Error('Error al subir imágenes');
        const imageUrls = await uploadRes.json();

        // Crear producto
        btn.textContent = 'Creando producto...';
        
        const product = {
            nameProduct: nombre,
            description: descripcion,
            amount: cantidad,
            price: precio,
            state: estado,
            category: categoria,
            imageUrls: imageUrls
        };

        const res = await fetch(API_BASE_URL + '/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (res.status === 201 || res.status === 200) {
            mostrarExito();
            document.getElementById('formProduct').reset();
            archivosSeleccionados = [];
            renderPreviews();
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            throw new Error('Error del servidor');
        }

    } catch (error) {
        mostrarError('Error al agregar el producto: ' + error.message);
    } finally {
        btn.textContent = textoOriginal;
        btn.disabled = false;
    }
});

// Mostrar mensaje de que el producto fue agregado con exito 
function mostrarExito() {
    let exitoDiv = document.getElementById('mensajeExito');
    if (!exitoDiv) {
        exitoDiv = document.createElement('div');
        exitoDiv.id = 'mensajeExito';
        exitoDiv.style.cssText = `
            background: #D1FAE5;
            color: #065F46;
            padding: 12px 20px;
            border-radius: 8px;
            margin: 10px 0;
            border: 1px solid #6EE7B7;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
        `;
        const form = document.getElementById('formProduct');
        form.insertBefore(exitoDiv, form.firstChild);
    }
    
    exitoDiv.textContent = '¡Producto agregado con éxito! Redirigiendo...';
    exitoDiv.style.display = 'block';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    setupContadorCaracteres();
});