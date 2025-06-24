// Substitua o conteúdo do seu arquivo www/js/app.js por este.

document.addEventListener('DOMContentLoaded', () => {
    // Redireciona se não estiver logado
    checkAuth();

    // Elementos da interface
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.calculator-section');
    const sectionTitle = document.getElementById('current-section-title');
    const logoutBtn = document.getElementById('logout-btn');
    const menuToggleBtn = document.getElementById('menu-toggle');
    const navContainer = document.querySelector('.sidebar-nav-container');

    // --- Lógica para o Menu Hambúrguer ---
    menuToggleBtn.addEventListener('click', () => {
        // Adiciona/remove a classe 'active' para mostrar/esconder o menu
        navContainer.classList.toggle('active');
        menuToggleBtn.classList.toggle('active');
    });

    // --- Lógica para a Navegação entre seções ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Atualiza o link ativo
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Mostra a seção correta
            const targetId = link.getAttribute('data-target');
            sections.forEach(sec => {
                sec.id === `${targetId}-section` ? sec.classList.add('active') : sec.classList.remove('active');
            });

            // Atualiza o título da seção
            sectionTitle.textContent = link.textContent;

            // Fecha o menu hambúrguer se estiver aberto (no modo mobile)
            if (window.innerWidth <= 768) {
                navContainer.classList.remove('active');
                menuToggleBtn.classList.remove('active');
            }
        });
    });

    // --- Lógica de Logout ---
    logoutBtn.addEventListener('click', logout);

    // --- Event Listeners para os formulários de cálculo ---
    const areaForm = document.getElementById('area-form');
    const materialsForm = document.getElementById('materials-form');
    const costsForm = document.getElementById('costs-form');

    areaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const width = parseFloat(document.getElementById('width').value);
        const length = parseFloat(document.getElementById('length').value);
        const result = calculateArea(width, length);
        const resultBox = document.getElementById('area-result');
        
        if (result.error) {
            resultBox.innerHTML = `<p class="error-message">${result.error}</p>`;
        } else {
            resultBox.innerHTML = `<p>Área Total Calculada: <strong>${result.area} m²</strong></p>`;
            document.getElementById('total-area').value = result.area;
        }
    });

    materialsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const area = parseFloat(document.getElementById('total-area').value);
        const materialType = document.getElementById('material-type').value;
        const result = calculateMaterials(area, materialType);
        const resultBox = document.getElementById('materials-result');

        if (result.error) {
            resultBox.innerHTML = `<p class="error-message">${result.error}</p>`;
        } else {
            resultBox.innerHTML = `<p>${result.message}</p>`;
        }
    });
    
    costsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quantity = parseFloat(document.getElementById('quantity').value);
        const price = parseFloat(document.getElementById('price').value);
        const result = calculateCosts(quantity, price);
        const resultBox = document.getElementById('costs-result');

        if (result.error) {
            resultBox.innerHTML = `<p class="error-message">${result.error}</p>`;
        } else {
            resultBox.innerHTML = `<p>Custo Total Estimado: <strong>${result.cost}</strong></p>`;
        }
    });
});