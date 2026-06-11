const {
  findUsuarioByCpfAndSenha
} = require('../repositories/usuario.repositories')
const { createToken, deletarToken } = require('../utils/jwt')
const { createHttpError } = require('../utils/http-error')

async function loginUsuario({ cpf, senha } = {}, res) {
  if (!cpf || !senha) {
    throw createHttpError(400, 'CPF e senha são obrigatorios')
  }

  try {
    const usuario = await findUsuarioByCpfAndSenha(cpf, senha)
    const token = createToken({ id_usuario: usuario.id_usuario }, res)

    return {
      token,
      nome: usuario.nome
    }
  } catch (error) {
    if (
      error.message === 'Usuario inexistente' ||
      error.message === 'Dados de login incorretos'
    ) {
      throw createHttpError(401, 'CPF ou senha incorretos.')
    }

    throw error
  }
}
async function logoutUsuario(res) {
  if (!res) {
    throw createHttpError(
      500,
      'Objeto de resposta (res) não fornecido ao serviço.'
    )
  }

  try {
    deletarToken(res)
    return { success: true, message: 'Sessão encerrada com sucesso.' }
  } catch (error) {
    throw createHttpError(500, 'Erro interno ao processar o logout.')
  }
}

module.exports = {
  logoutUsuario,
  loginUsuario
}
