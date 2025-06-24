// A PRIMEIRA LINHA DE TODAS: Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// 1. Importação dos Módulos
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 2. Configuração Inicial do Servidor
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 3. Configuração do Banco de Dados (PostgreSQL)
// O pool agora lê a string de conexão segura do seu arquivo .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 4. Middleware (Exemplo para verificação de autenticação futura)
function checkAuth(req, res, next) {
    // Em um app real, você validaria um Token (JWT) aqui.
    // Por enquanto, vamos permitir a passagem.
    next();
}

// =================================================================
// ROTAS DE AUTENTICAÇÃO
// =================================================================

// ROTA DE CADASTRO DE NOVO USUÁRIO
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const newUser = await pool.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
            [nome, email, senhaHash]
        );

        res.status(201).json(newUser.rows[0]);

    } catch (err) {
        console.error("Erro no /register:", err.message);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
        }
        res.status(500).json({ error: 'Erro interno do servidor ao tentar cadastrar.' });
    }
});

// ROTA DE LOGIN
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }
        
        res.json({ id: user.id, nome: user.nome, email: user.email });

    } catch (err) {
        console.error("Erro no /login:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// ROTA DE LOGOUT (Lógica a ser implementada no frontend)
app.post('/logout', (req, res) => {
    res.json({ message: 'Logout bem-sucedido' });
});


// =================================================================
// ROTAS DE RECUPERAÇÃO DE SENHA
// =================================================================

const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro provedor
    auth: {
        user: process.env.EMAIL_USER, // Variável do seu arquivo .env
        pass: process.env.EMAIL_PASS  // Variável do seu arquivo .env
    }
});

// ROTA PARA SOLICITAR REDEFINIÇÃO DE SENHA
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (rows.length === 0) {
            // Resposta genérica por segurança
            return res.json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação será enviado.' });
        }

        const user = rows[0];
        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000); // Token válido por 1 hora

        await pool.query('DELETE FROM password_resets WHERE email = $1', [email]);
        await pool.query('INSERT INTO password_resets (email, token, expires) VALUES ($1, $2, $3)', [email, token, expires]);

        const resetLink = `http://127.0.0.1:5500/www/reset-password.html?token=${token}`; // LINK CORRETO PARA O FRONTEND
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Recuperação de Senha - ArqCalc',
            html: `<p>Olá ${user.nome},</p><p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova senha:</p><a href="${resetLink}">Redefinir Senha</a><p>Se você não fez essa solicitação, pode ignorar este e-mail.</p>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Link de recuperação enviado para o seu e-mail.' });

    } catch (err) {
        console.error('Erro no /forgot-password:', err);
        res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação.' });
    }
});

// ROTA PARA EFETIVAMENTE REDEFINIR A SENHA
app.post('/reset-password', async (req, res) => {
    const { token, senha } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM password_resets WHERE token = $1 AND expires > NOW()', [token]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }

        const resetRequest = rows[0];
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        await pool.query('UPDATE usuarios SET senha = $1 WHERE email = $2', [senhaHash, resetRequest.email]);
        await pool.query('DELETE FROM password_resets WHERE token = $1', [token]);

        res.json({ message: 'Senha redefinida com sucesso!' });

    } catch (err) {
        console.error("Erro no /reset-password:", err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// =================================================================
// ROTAS DO APLICATIVO
// =================================================================

app.get('/dados-usuario', checkAuth, async (req, res) => {
    const userId = 1; // Fixo para exemplo
    try {
        const { rows } = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = $1', [userId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.get('/calculos/historico', checkAuth, async (req, res) => {
    const userId = 1; // Fixo para exemplo
    try {
        const { rows } = await pool.query('SELECT * FROM calculos WHERE usuario_id = $1 ORDER BY data_calculo DESC', [userId]);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.post('/calculos', checkAuth, async (req, res) => {
    const userId = 1; // Fixo para exemplo
    const { tipo_calculo, dados_entrada, resultado } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO calculos (usuario_id, tipo_calculo, dados_entrada, resultado) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, tipo_calculo, JSON.stringify(dados_entrada), JSON.stringify(resultado)]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// 5. Inicialização do Servidor
app.listen(port, () => {
    console.log(`Servidor back-end rodando em http://localhost:${port}`);
});