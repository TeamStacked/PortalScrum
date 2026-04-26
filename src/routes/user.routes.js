const express = require('express');
const router  = express.Router();
const db      = require('../database/db');

const {cadatrarUsuarioBD} = require("../database/users");

//curl -X POST http://localhost:3000/api/cadastro -H "Content-Type: application/json" -d "{\"cpf\":\"320.340.950-10\",\"nome\":\"Daniel\",\"email\":\"daniel@teste.com\",\"senha\":\"1234"\",\"hash\":\"1234"\"}"
router.post("/cadastro", async function(req, res){
        const{cpf, nome, email, senha, hash} = req.body;
        try{
            if (!cpf || !nome || !email || !senha) {
                return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
            }
            const response = await cadatrarUsuarioBD(cpf,nome,email,senha,hash);
            if(response!=""){
                return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });

            }else{
                return res.status(404).json({ mensagem: 'Não foi possivel cadastrar usuario.' });
            }
        }catch(err){
            if (err.code === '23505') {
                return res.status(409).json({ erro: 'CPF ou e-mail já cadastrado.' });
            }
            console.log(err);
            console.error(err);
            return res.status(500).json({ erro: 'Erro interno.' });
        }
});
/*
router.post('/cadastro', async (req, res) => {
  try {
    const { cpf, nome, email, senha } = req.body;
    if (!cpf || !nome || !email || !senha) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query(
      'INSERT INTO usuarios (cpf, nome, email, senha_hash) VALUES ($1, $2, $3, $4)',
      [cpf, nome, email, senhaHash]
    );

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'CPF ou e-mail já cadastrado.' });
    }
    console.log(err);
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ erro: 'Refresh token não informado.' });
  const resultado = verificarRefreshToken(refreshToken);
  if (!resultado.valido) return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  const novoAccessToken = gerarAccessToken({ id: resultado.dados.sub });
  return res.json({ accessToken: novoAccessToken });
});
*/
/*
router.post('/logout', autenticar, async (req, res) => {
  await db.query('UPDATE usuarios SET refresh_token = NULL WHERE id = $1', [req.usuario.sub]);
  return res.json({ mensagem: 'Logout realizado.' });
});

router.get('/me', autenticar, (req, res) => {
  return res.json(req.usuario);
});
*/
module.exports = router;