const {
    findResultadoExameAtualByUsuario,
    findResultadoExame,
    sincronizarDesbloqueioModulos
  } = require('../repositories/questoes.repositories')
  const { createHttpError } = require('../utils/http-error')
  
  // Essa funcao lista os modulos do usuario e seus status
async function listarModulosDoUsuario(idUsuario) {
    return sincronizarDesbloqueioModulos(idUsuario)
  }
  
  // Essa funcao busca o resultado do exame atual do usuario
async function buscarResultadoAtual(idUsuario, { id_exame, modulo } = {}) {
    const idExame = id_exame ? Number(id_exame) : null
    const idModulo = modulo ? Number(modulo) : null
  
    const resultado = await findResultadoExameAtualByUsuario(
      idUsuario,
      idExame,
      idModulo
    )
  
    validarResultado(resultado, {
      notFoundMessage: 'Nenhum exame encontrado.',
      incluirDetalhesConflito: true
    })
    return resultado
  }
  
  // Essa funcao busca o resultado de um exame pelo seu ID
async function buscarResultadoPorId(idUsuario, idExameParam) {
    const idExame = Number(idExameParam)
    const resultado = await findResultadoExame(idExame, idUsuario)
  
    validarResultado(resultado, {
      notFoundMessage: 'Exame não encontrado.',
      incluirDetalhesConflito: false
    })
    return resultado
  }
  
  // Essa funcao valida o resultado de um exame
function validarResultado(
    resultado,
    { notFoundMessage, incluirDetalhesConflito }
  ) {
    if (!resultado) {
      throw createHttpError(404, notFoundMessage)
    }
  
    if (!resultado.concluido) {
      const details = incluirDetalhesConflito
        ? {
            id_exame: resultado.id_exame,
            id_modulo: resultado.id_modulo
          }
        : {}
  
      throw createHttpError(
        409,
        'Esta tentativa ainda não foi finalizada.',
        details
      )
    }
  }
  
  module.exports = {
    listarModulosDoUsuario,
    buscarResultadoAtual,
    buscarResultadoPorId
  }