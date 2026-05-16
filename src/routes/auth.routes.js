const { Router } = require('express')
const {
  findUsuarioByCpfAndSenha
} = require('../repositories/usuario.repositories')
const { createToken } = require('../utils/jwt')

const router = Router()

router.post('/login', async function (req, res) {
  const { cpf, senha } = req.body

  if (!cpf || !senha) {
    return res.status(400).json({ message: 'CPF e senha são obrigatórios' })
  }

  try {
    const usuario = await findUsuarioByCpfAndSenha(cpf, senha)
    const token = createToken({ id_usuario: usuario.id_usuario })
    return res.status(200).json({ token, nome: usuario.nome })
  } catch (e) {
    // Erros de credencial → 401
    if (
      error.message === 'Usuário não encontrado.' ||
      error.message === 'Senha inválida.'
    ) {
      return res.status(401).json({ message: 'CPF ou senha incorretos.' })
    }
    // Erros inesperados → 500
    return res.status(500).json({ message: 'Erro interno do servidor.' })
  }
})

module.exports = router
