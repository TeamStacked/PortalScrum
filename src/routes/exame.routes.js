const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
    contarTentativas,
    sortearQuestoes,
    createExame,
    persistirQuestoesAuditoria,
} = require("../repositories/exame.repositories");

const router = Router();

// POST /api/exames — cria exame, sorteia e persiste questões para auditoria
router.post("/", authMiddleware, async function (req, res) {
    const idUsuario = req.usuario.id_usuario;
    const { id_modulo } = req.body;

    if (!id_modulo) {
        return res.status(400).json({ message: "id_modulo é obrigatório" });
    }

    try {
        const totalTentativas = await contarTentativas(idUsuario, id_modulo);
        if (totalTentativas >= 2) {
            return res.status(403).json({
                message: "Limite de 2 tentativas por módulo atingido",
            });
        }

        const tentativa = totalTentativas + 1;
        const questoes = await sortearQuestoes(id_modulo);

        if (questoes.length < 10) {
            return res.status(422).json({
                message: "Questões insuficientes no banco para este módulo",
            });
        }

        const exame = await createExame(idUsuario, id_modulo, tentativa);
        await persistirQuestoesAuditoria(exame.id_exame, questoes);

        return res.status(201).json({
            id_exame: exame.id_exame,
            tentativa: exame.tentativa,
            questoes,
        });
    } catch (e) {
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

module.exports = router;