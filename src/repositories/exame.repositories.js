const pool = require("../database/db");

// Conta quantas tentativas o usuário já fez em um módulo (RF06 - máx 2)
async function contarTentativas(idUsuario, idModulo) {
    const result = await pool.query(
        `SELECT COUNT(*) AS total
         FROM public.exames
         WHERE id_usuario = $1 AND id_modulo = $2`,
        [idUsuario, idModulo]
    );
    return parseInt(result.rows[0].total);
}

// Sorteia 10 questões do módulo: 3 fáceis, 4 médias, 3 difíceis (RF03, RF04, RF05)
async function sortearQuestoes(idModulo) {
    const result = await pool.query(
        `(SELECT id_questao FROM public.questoes WHERE id_modulo = $1 AND dificuldade = 'facil' ORDER BY RANDOM() LIMIT 3)
         UNION ALL
         (SELECT id_questao FROM public.questoes WHERE id_modulo = $1 AND dificuldade = 'media' ORDER BY RANDOM() LIMIT 4)
         UNION ALL
         (SELECT id_questao FROM public.questoes WHERE id_modulo = $1 AND dificuldade = 'dificil' ORDER BY RANDOM() LIMIT 3)`,
        [idModulo]
    );
    return result.rows.map((r) => r.id_questao);
}

// Cria o registro do exame no banco (task 19)
async function createExame(idUsuario, idModulo, tentativa) {
    const result = await pool.query(
        `INSERT INTO public.exames (id_usuario, id_modulo, tentativa)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [idUsuario, idModulo, tentativa]
    );
    return result.rows[0];
}

// Persiste as questões sorteadas para auditoria (RF10 - task 19)
async function persistirQuestoesAuditoria(idExame, idsQuestoes) {
    const values = idsQuestoes
        .map((_, i) => `($1, $${i + 2})`)
        .join(", ");
    const params = [idExame, ...idsQuestoes];
    await pool.query(
        `INSERT INTO public.respostas (id_exame, id_questao)
         VALUES ${values}`,
        params
    );
}

// Busca resposta já registrada por exame e questão (task 18 - evitar duplicidade)
async function findRespostaByExameEQuestao(idExame, idQuestao) {
    const result = await pool.query(
        `SELECT * FROM public.respostas
         WHERE id_exame = $1 AND id_questao = $2`,
        [idExame, idQuestao]
    );
    return result.rows[0] || null;
}

module.exports = {
    contarTentativas,
    sortearQuestoes,
    createExame,
    persistirQuestoesAuditoria,
    findRespostaByExameEQuestao,
};