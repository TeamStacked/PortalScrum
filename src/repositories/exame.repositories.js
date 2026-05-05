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

module.exports = { contarTentativas, sortearQuestoes, createExame };