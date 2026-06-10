const pool = require('../database/db')
const {
  findModulosRespondidosByUsuario
} = require('../repositories/questoes.repositories')
const {
  NOTA_MINIMA_APROVACAO,
  QUESTOES_POR_TENTATIVA
} = require('../utils/calcule')

async function findUsuarioByCertificadoHash(certificadoHash) {
  const result = await pool.query(
    `SELECT id_usuario, nome, cpf, email,certificado_hash
      FROM usuarios 
      WHERE certificado_hash = $1`,
    [certificadoHash]
  )
  return result.rows[0] || null
}

// Retorna todos os módulos cadastrados
async function findModulos() {
  const result = await pool.query(
    `SELECT id_modulo, titulo FROM modulos m ORDER BY id_modulo ASC`
  )
  return result.rows
}

// Organiza a lista de tentativas em um Map indexado por id_modulo
// Essa funcao agrupa as tentativas de exame por modulo
function groupTentativasByModulo(tentativas) {
  return tentativas.reduce((groups, tentativa) => {
    const idModulo = Number(tentativa.id_modulo)

    if (!groups.has(idModulo)) {
      groups.set(idModulo, [])
    }

    groups.get(idModulo).push(tentativa)

    return groups
  }, new Map())
}

// Essa funcao mapeia os dados do modulo e suas respectivas tentativas
function mapModulo(modulo, tentativas) {
  return {
    id_modulo: modulo.id_modulo,
    titulo: modulo.titulo,
    metaQuestoes: Number(tentativas[0]?.questoes) || 0,
    notasTentativas: tentativas.map((tentativa) => ({
      nota: Number(tentativa.nota) || 0,
      metaQuestoes: Number(tentativa.questoes) || 0,
      tentativa: tentativa.tentativa,
      concluida:
        Number(tentativa.questoes_respondidas) >= Number(tentativa.questoes),
      inicioEm: tentativa.inicio,
      fimEm: tentativa.fim
    }))
  }
}

// Essa funcao calcula o periodo de inicio e fim das tentativas concluidas
function getCertificatePeriod(modulosConcluidos) {
  const dates = modulosConcluidos
    .flatMap((modulo) => modulo.notasTentativas)
    .filter((tentativa) => tentativa.concluida)
    .flatMap((tentativa) => [tentativa.inicioEm, tentativa.fimEm])
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())

  return {
    inicioEm: dates[0]?.toISOString() || null,
    fimEm: dates[dates.length - 1]?.toISOString() || null
  }
}

// Calcula a média das melhores notas por módulo conforme RF08
// Essa funcao gera a media final das melhores notas por modulo
async function gerarMediaFinal(id_usuario) {
  const response = await pool.query(
    `WITH tentativas_concluidas AS (
       SELECT
         e.id_exame,
         e.id_modulo,
         ROUND((COALESCE(SUM(r.nota), 0)::numeric / COUNT(q.id_questao)) * 100) AS nota
       FROM exames e
       INNER JOIN questoes q
         ON q.id_modulo = e.id_modulo
         AND q.grupo IS NOT DISTINCT FROM e.grupo
       LEFT JOIN respostas r
         ON r.id_exame = e.id_exame
         AND r.id_questao = q.id_questao
       WHERE e.id_usuario = $1
       GROUP BY e.id_exame, e.id_modulo
       HAVING COUNT(r.id_resposta) >= COUNT(q.id_questao)
         AND COUNT(q.id_questao) = ${QUESTOES_POR_TENTATIVA}
     ),
     melhores_por_modulo AS (
       SELECT id_modulo, MAX(nota) AS melhor_nota
       FROM tentativas_concluidas
       GROUP BY id_modulo
     )
     SELECT ROUND(AVG(melhor_nota), 2) AS media_certificado
     FROM melhores_por_modulo`,
    [id_usuario]
  )
  return response.rows[0]
}

// Essa funcao busca as informacoes do certificado pelo hash
async function findCertificadoByHash(certificadoHash) {
  const usuario = await findUsuarioByCertificadoHash(certificadoHash)

  if (!usuario) {
    return null
  }

  const modulosRows = await findModulos()
  const tentativas = await findModulosRespondidosByUsuario(usuario.id_usuario)
  const tentativasByModulo = groupTentativasByModulo(tentativas)
  const modulos = []
  const modulosConcluidos = []

  for (const moduloRow of modulosRows) {
    const idModulo = Number(moduloRow.id_modulo)
    const tentativasDoModulo = tentativasByModulo.get(idModulo) || []
    const modulo = mapModulo(moduloRow, tentativasDoModulo)

    modulos.push(modulo)

    let moduloConcluido = false

    for (const tentativa of modulo.notasTentativas) {
      if (
        tentativa.concluida &&
        Number(tentativa.nota) >= NOTA_MINIMA_APROVACAO
      ) {
        moduloConcluido = true
        break
      }
    }

    if (moduloConcluido) {
      modulosConcluidos.push(modulo)
    }
  }

  if (!modulos.length || modulosConcluidos.length !== modulos.length) {
    return {
      indisponivel: true,
      motivo:
        'Certificado indisponível: Conclusão de todos os módulos obrigatória.'
    }
  }

  const periodo = getCertificatePeriod(modulosConcluidos)
  const mediaFinal = await gerarMediaFinal(usuario.id_usuario)
  return {
    aluno: {
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email
    },
    certificado: {
      certificadoHash: usuario.certificado_hash,
      codigoValidacao: usuario.certificado_hash,
      emitidoEm: periodo.fimEm,
      inicioEm: periodo.inicioEm,
      fimEm: periodo.fimEm
    },
    progresso: {
      modulosConcluidos
    },
    mediaFinal: parseFloat(mediaFinal?.media_certificado ?? 0)
  }
}

// Essa funcao busca o progresso do usuario pelo id
async function findProgressoByUsuarioId(idUsuario) {
  const modulosRows = await findModulos()
  const tentativas = await findModulosRespondidosByUsuario(idUsuario)
  const tentativasByModulo = groupTentativasByModulo(tentativas)
  const modulos = []
  const modulosConcluidos = []

  for (const moduloRow of modulosRows) {
    const idModulo = Number(moduloRow.id_modulo)
    const tentativasDoModulo = tentativasByModulo.get(idModulo) || []
    const modulo = mapModulo(moduloRow, tentativasDoModulo)

    modulos.push(modulo)

    let moduloConcluido = false

    for (const tentativa of modulo.notasTentativas) {
      if (
        tentativa.concluida &&
        Number(tentativa.nota) >= NOTA_MINIMA_APROVACAO
      ) {
        moduloConcluido = true
        break
      }
    }

    if (moduloConcluido) {
      modulosConcluidos.push(modulo)
    }
  }

  if (!modulos.length || modulosConcluidos.length !== modulos.length) {
    return {
      indisponivel: true,
      motivo:
        'Certificado indisponivel pois nao foi concluido todos os modulos.'
    }
  }

  return null
}

module.exports = {
  findCertificadoByHash,
  findProgressoByUsuarioId
}
