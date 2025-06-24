// Aguarda o DOM estar completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos do DOM ---
    const menuToggleButton = document.getElementById('menu-toggle');
    const sidebarNavContainer = document.getElementById('sidebar-nav');
    const logoutButton = document.getElementById('logout-btn');
    const userNameSpan = document.getElementById('user-name');
    const navLinks = document.querySelectorAll('.nav-link');
    const calculatorSections = document.querySelectorAll('.calculator-section');

    // --- Lógica de Logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Remove os dados do usuário do armazenamento local
            localStorage.removeItem('user');
            // Redireciona para a página de login
            window.location.href = 'index.html';
        });
    }

    // --- Lógica do Menu Mobile (Hambúrguer) ---
    if (menuToggleButton && sidebarNavContainer) {
        menuToggleButton.addEventListener('click', () => {
            // Adiciona ou remove a classe 'active' para animar o botão e mostrar/esconder o menu
            menuToggleButton.classList.toggle('active');
            sidebarNavContainer.classList.toggle('active');
        });
    }

    // --- Lógica de Navegação entre Calculadoras (Abas) ---
    if (navLinks.length > 0 && calculatorSections.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Remove a classe 'active' de todos os links e seções
                navLinks.forEach(l => l.classList.remove('active'));
                calculatorSections.forEach(s => s.classList.remove('active'));

                // Adiciona a classe 'active' ao link clicado e à seção correspondente
                link.classList.add('active');
                const targetId = link.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }
    
    // --- Personalização da Página ---
    // Pega os dados do usuário do localStorage e exibe o nome
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.nome && userNameSpan) {
        // Pega o primeiro nome para uma saudação mais pessoal
        const firstName = user.nome.split(' ')[0];
        userNameSpan.textContent = firstName;
    } else if (userNameSpan) {
        userNameSpan.textContent = "Usuário";
    }

});
