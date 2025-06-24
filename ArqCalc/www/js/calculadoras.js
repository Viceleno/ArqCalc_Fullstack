// js/calculators.js

// --- Lógica para o Cálculo de Áreas ---
function calculateArea(width, length) {
    if (isNaN(width) || isNaN(length) || width <= 0 || length <= 0) {
        return { error: "Por favor, insira valores válidos e positivos." };
    }
    const area = width * length;
    return { area: area.toFixed(2) };
}

// --- Lógica para o Cálculo de Materiais ---
function calculateMaterials(area, materialType) {
    if (isNaN(area) || area <= 0) {
        return { error: "A área total deve ser um número válido e positivo." };
    }

    let result = {};
    
    // TODO: A lógica abaixo é DEMONSTRATIVA. Substitua pelas fórmulas corretas da ABNT.
    switch (materialType) {
        case 'tijolo':
            // Exemplo simples: 25 tijolos por m²
            const tijolosPorMetro = 25;
            const totalTijolos = Math.ceil(area * tijolosPorMetro);
            result.message = `Para uma área de ${area} m², você precisará de aproximadamente ${totalTijolos} tijolos.`;
            break;
        case 'piso':
            // Exemplo simples: Piso 60x60 (0.36m² por peça), mais 10% de perda
            const areaPorPeca = 0.6 * 0.6;
            const pecasNecessarias = area / areaPorPeca;
            const totalComPerda = Math.ceil(pecasNecessarias * 1.10); 
            result.message = `Para uma área de ${area} m², você precisará de ${totalComPerda} peças de piso (considerando 10% de perda).`;
            break;
        default:
            result.error = "Tipo de material não reconhecido.";
    }
    return result;
}

// --- Lógica para o Cálculo de Custos ---
function calculateCosts(quantity, price) {
    if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price < 0) {
        return { error: "Por favor, insira valores válidos e positivos." };
    }
    const totalCost = quantity * price;
    return { cost: `R$ ${totalCost.toFixed(2)}` };
}