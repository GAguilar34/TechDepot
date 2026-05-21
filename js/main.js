function getCurrentCustomer() {
    const storedCustomer = localStorage.getItem('customer');

    if (!storedCustomer) {
        return null;
    }

    try {
        return JSON.parse(storedCustomer);
    } catch (error) {
        localStorage.removeItem('customer');
        return null;
    }
}

function isSeller(customer) {
    return customer && customer.userType === 'VENDEDOR';
}

function setupSessionUI() {
    const customer = getCurrentCustomer();
    const loginButton = document.getElementById('btnIncioSesion');
    const accountContainer = document.querySelector('.contentUser');
    const sellButton = document.getElementById('btnSell');
    const sellMenuItem = sellButton ? sellButton.closest('#menu-item') : null;

    if (loginButton) {
        if (customer) {
            loginButton.style.display = 'none';

            const userLabel = document.createElement('span');
            userLabel.textContent = customer.name || customer.email || 'Usuario';
            userLabel.id = 'usuarioActivo';
            accountContainer.appendChild(userLabel);
        } else {
            loginButton.addEventListener('click', function () {
                window.location.href = 'login.html';
            });
        }
    }

    if (sellMenuItem && !isSeller(customer)) {
        sellMenuItem.style.display = 'none';
    }

    if (sellButton) {
        sellButton.addEventListener('click', function () {
            window.location.href = 'ventas.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', setupSessionUI);