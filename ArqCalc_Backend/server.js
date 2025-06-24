const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurações do servidor
app.use(cors()); // Permite que o app Cordova se conecte
app.use(express.json()); // Permite que o servidor entenda JSON

// Configuração da conexão com o PostgreSQL
// ATENÇÃO: Altere 'sua_senha_aqui' para a senha que você criou na instalação do Postgre
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'arqcalc',
    password: 'sua_senha_aqui',
    port: 5432,
});

// --- API Endpoint para Login ---
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // ALERTA DE SEGURANÇA: Esta verificação é apenas para exemplo.
    // NUNCA compare senhas em texto puro em produção. Use bcrypt.
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        
        if (result.rows.length > 0) {
            // Usuário encontrado
            res.json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            // Usuário não encontrado ou senha incorreta
            res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
        }
    } catch (error) {
        console.error('Erro no endpoint /login:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor back-end rodando em http://localhost:${port}`);
});