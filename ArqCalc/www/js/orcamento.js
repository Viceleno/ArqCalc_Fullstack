document.addEventListener('DOMContentLoaded', () => {

    // Elementos da tabela e formulário
    const orcamentoList = document.getElementById('orcamento-list');
    const addItemBtn = document.getElementById('add-item-btn');
    const itemDescricaoInput = document.getElementById('item-descricao');
    const itemUnidadeInput = document.getElementById('item-unidade');
    const itemQuantidadeInput = document.getElementById('item-quantidade');
    const itemPrecoInput = document.getElementById('item-preco');
    
    // Elementos do resumo de custos
    const custoDiretoTotalEl = document.getElementById('custo-direto-total');
    const bdiPercentInput = document.getElementById('bdi-percent');
    const bdiValorEl = document.getElementById('bdi-valor');
    const precoFinalVendaEl = document.getElementById('preco-final-venda');

    // Elementos do Modal de Informações
    const infoModal = document.getElementById('info-modal');
    const infoModalTitle = document.getElementById('info-modal-title');
    const infoModalContent = document.getElementById('info-modal-content');
    const closeInfoModalBtn = document.getElementById('close-info-modal');

    // Conteúdo didático
    const infoContent = {
        'bdi': {
            title: 'BDI - Benefícios e Despesas Indiretas',
            content: `
                <p>O <strong>BDI</strong> é um percentual aplicado sobre o custo direto de uma obra para cobrir despesas que não estão diretamente ligadas aos materiais e mão de obra, mas são essenciais para a realização do projeto.</p>
                <p>Ele inclui:</p>
                <ul>
                    <li><strong>Administração Central:</strong> Custos do escritório (aluguel, salários administrativos, etc.).</li>
                    <li><strong>Custos Financeiros:</strong> Juros, garantias, etc.</li>
                    <li><strong>Impostos:</strong> ISS, PIS, COFINS, etc.</li>
                    <li><strong>Seguros e Riscos:</strong> Imprevistos e seguros obrigatórios.</li>
                    <li><strong>Lucro:</strong> A margem de lucro desejada pela empresa.</li>
                </ul>
                <p>A fórmula básica do Preço de Venda é: <strong>Preço de Venda = Custo Direto x (1 + BDI / 100)</strong>.</p>
                <p><em>Referência conceitual: ABNT NBR 12.721 e boas práticas de gestão de obras.</em></p>
            `
        },
        // Adicione mais conteúdos aqui conforme necessário
    };

    let orcamentoItems = [];
    let itemIdCounter = 0;

    // --- FUNÇÕES ---

    // Renderiza a tabela de orçamento
    const renderTable = () => {
        orcamentoList.innerHTML = '';
        if (orcamentoItems.length === 0) {
            orcamentoList.innerHTML = '<tr><td colspan="6" class="empty-message">Nenhum item adicionado ao orçamento.</td></tr>';
        } else {
            orcamentoItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.descricao}</td>
                    <td>${item.unidade}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.preco.toFixed(2)}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                    <td>
                        <button class="btn-icon btn-delete" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                orcamentoList.appendChild(row);
            });
        }
        updateSummary();
    };

    // Atualiza o resumo de custos
    const updateSummary = () => {
        const custoDireto = orcamentoItems.reduce((total, item) => total + item.subtotal, 0);
        const bdiPercent = parseFloat(bdiPercentInput.value) || 0;
        const bdiValor = custoDireto * (bdiPercent / 100);
        const precoFinal = custoDireto + bdiValor;

        custoDiretoTotalEl.textContent = `R$ ${custoDireto.toFixed(2)}`;
        bdiValorEl.textContent = `R$ ${bdiValor.toFixed(2)}`;
        precoFinalVendaEl.textContent = `R$ ${precoFinal.toFixed(2)}`;
    };
    
    // Adiciona um novo item ao orçamento
    const handleAddItem = () => {
        const descricao = itemDescricaoInput.value.trim();
        const unidade = itemUnidadeInput.value.trim();
        const quantidade = parseFloat(itemQuantidadeInput.value);
        const preco = parseFloat(itemPrecoInput.value);

        if (!descricao || !unidade || isNaN(quantidade) || isNaN(preco) || quantidade <= 0 || preco < 0) {
            alert('Por favor, preencha todos os campos do item corretamente.');
            return;
        }

        const newItem = {
            id: itemIdCounter++,
            descricao,
            unidade,
            quantidade,
            preco,
            subtotal: quantidade * preco
        };
        
        orcamentoItems.push(newItem);
        renderTable();

        // Limpa o formulário
        itemDescricaoInput.value = '';
        itemUnidadeInput.value = '';
        itemQuantidadeInput.value = '1';
        itemPrecoInput.value = '';
        itemDescricaoInput.focus();
    };

    // Remove um item do orçamento
    const handleDeleteItem = (e) => {
        if (e.target.closest('.btn-delete')) {
            const button = e.target.closest('.btn-delete');
            const idToRemove = parseInt(button.dataset.id);
            orcamentoItems = orcamentoItems.filter(item => item.id !== idToRemove);
            renderTable();
        }
    };
    
    // Abre o modal de informações
    const showInfoModal = (infoKey) => {
        const data = infoContent[infoKey];
        if (data) {
            infoModalTitle.textContent = data.title;
            infoModalContent.innerHTML = data.content;
            infoModal.style.display = 'flex';
        }
    };

    // --- EVENT LISTENERS ---
    
    addItemBtn.addEventListener('click', handleAddItem);
    orcamentoList.addEventListener('click', handleDeleteItem);
    bdiPercentInput.addEventListener('input', updateSummary);
    
    // Listener para todos os ícones de informação
    document.addEventListener('click', (e) => {
        const infoIcon = e.target.closest('.info-icon');
        if (infoIcon) {
            const infoKey = infoIcon.dataset.info;
            showInfoModal(infoKey);
        }
    });

    closeInfoModalBtn.addEventListener('click', () => {
        infoModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });


    // Inicialização da página
    renderTable(); 
});
