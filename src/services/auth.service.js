const {
  findUsuarioByCpfAndSenha,
} = require("../repositories/usuario.repositories");
const { createToken, deletarToken} = require("../utils/jwt");
const { createHttpError } = require("../utils/http-error");

async function loginUsuario({ cpf, senha } = {}, res) {
  if (!cpf || !senha) {
    throw createHttpError(400, "CPF e senha sao obrigatorios");
  }

  try {
    const usuario = await findUsuarioByCpfAndSenha(cpf, senha);
    const token = createToken({ id_usuario: usuario.id_usuario }, res);

    return {
      token,
      nome: usuario.nome,
    };
  } catch (error) {
    if (
      error.message === "usuario inexistente" ||
      error.message === "Dados de login incorretos"
    ) {
      throw createHttpError(401, "CPF ou senha incorretos.");
    }

    throw error;
  }
}
async function logoutUsuario(res) {
    try{
      return deletarToken(res)
    }catch(error){
      throw createHttpError(401, "Erro em sair ")
    }
}

module.exports = {
  logoutUsuario,
  loginUsuario,
};
