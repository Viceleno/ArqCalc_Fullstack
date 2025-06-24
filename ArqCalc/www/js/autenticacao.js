document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('dashboard-container')) {
        checkAuth();
    }
    if (document.getElementById('login-form')) {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';

    try {
        // Chama o nosso novo servidor back-end
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Login bem-sucedido
            sessionStorage.setItem('loggedInUser', username);
            window.location.href = 'dashboard.html';
        } else {
            // Credenciais inválidas (resposta do servidor)
            errorEl.textContent = data.message;
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        errorEl.textContent = 'Não foi possível conectar ao servidor. Verifique se ele está rodando.';
    }
}

function checkAuth() {
    const user = sessionStorage.getItem('loggedInUser');
    if (!user) {
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}