// Espera o HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // URL base da sua API backend
    const API_URL = 'http://localhost:3000';

    // ===============================================
    // Seleção de Elementos do DOM
    // ===============================================

    // Formulários
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    // Modais
    const signupModal = document.getElementById('signup-modal');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');

    // Botões e Links para abrir os modais
    const showSignupBtn = document.getElementById('show-signup');
    const showForgotPasswordBtn = document.getElementById('show-forgot-password');

    // Botões para fechar os modais
    const closeSignupModalBtn = document.getElementById('close-signup-modal');
    const closeForgotModalBtn = document.getElementById('close-forgot-modal');

    // Elementos para exibir mensagens de erro/sucesso
    const loginErrorEl = document.getElementById('login-error');
    const signupErrorEl = document.getElementById('signup-error');
    const forgotMessageEl = document.getElementById('forgot-message');


    // ===============================================
    // Lógica para Controle dos Modais
    // ===============================================

    // Abrir modal de Cadastro
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'flex';
    });

    // Abrir modal de Esqueci a Senha
    showForgotPasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.style.display = 'flex';
    });

    // Fechar modal de Cadastro
    closeSignupModalBtn.addEventListener('click', () => {
        signupModal.style.display = 'none';
    });

    // Fechar modal de Esqueci a Senha
    closeForgotModalBtn.addEventListener('click', () => {
        forgotPasswordModal.style.display = 'none';
    });

    // Fechar modais clicando fora da "caixa"
    window.addEventListener('click', (e) => {
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });


    // ===============================================
    // Lógica de Submissão dos Formulários
    // ===============================================

    // --- Formulário de LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginErrorEl.textContent = ''; // Limpa erros antigos

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, senha: password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erro desconhecido');
                }

                // Salva os dados do usuário no localStorage para simular uma sessão
                localStorage.setItem('user', JSON.stringify(data));
                
                // Redireciona para o dashboard
                window.location.href = 'dashboard.html';

            } catch (error) {
                loginErrorEl.textContent = error.message;
            }
        });
    }

    // --- Formulário de CADASTRO ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            signupErrorEl.textContent = ''; // Limpa erros antigos

            const nome = signupForm.nome.value;
            const email = signupForm.email.value;
            const senha = signupForm.senha.value;
            
            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                     throw new Error(data.error || 'Erro ao cadastrar');
                }

                alert('Cadastro realizado com sucesso! Você já pode fazer o login.');
                signupModal.style.display = 'none'; // Fecha o modal
                signupForm.reset(); // Limpa o formulário

            } catch (error) {
                signupErrorEl.textContent = error.message;
            }
        });
    }

    // --- Formulário de ESQUECI A SENHA ---
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            forgotMessageEl.textContent = '';

            const email = forgotPasswordForm.email.value;

            try {
                const response = await fetch(`${API_URL}/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                
                if (!response.ok) {
                     throw new Error(data.error || 'Ocorreu um erro.');
                }
                
                // Mostra a mensagem de sucesso para o usuário
                forgotMessageEl.textContent = data.message;
                forgotPasswordForm.reset();

            } catch (error) {
                forgotMessageEl.textContent = error.message;
                forgotMessageEl.style.color = 'red';
            }
        });
    }
});


// Você pode chamar esta função a partir de um botão "Sair" no seu dashboard.html
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}