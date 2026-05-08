const { Router } = require("express"); 
const {
  findUsuarioByCpfAndSenha,
} = require("../repositories/usuario.repositories"); 
const { createToken } = require("../utils/jwt");

const router = Router();

router.post("/login", async function (req, res) {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).json({ message: "CPF e senha são obrigatórios" });
  }

  try {
    const usuario = await findUsuarioByCpfAndSenha(cpf, senha);

    if (!usuario) {
      return res.status(401).json({ message: "CPF ou senha inválidos" });
    }

    const token = createToken({ id_usuario: usuario.id_usuario });

    return res.status(200).json({
      token,
      nome: usuario.nome,
    });
  } catch (e) {
    console.error("[POST /auth/login]", e); 

    if (e.message === "Credenciais inválidas" || e.status === 401) {
      return res.status(401).json({ message: "CPF ou senha inválidos" });
    }

    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

module.exports = router;