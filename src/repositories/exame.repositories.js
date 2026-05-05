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

module.exports = { contarTentativas };