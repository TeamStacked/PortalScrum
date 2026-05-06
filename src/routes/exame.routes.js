const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
    contarTentativas,
    sortearQuestoes,
    createExame,
    persistirQuestoesAuditoria,
    findRespostaByExameEQuestao,
    inserirResposta,
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

// POST /api/exames/:id/respostas — registra resposta com metadados (tasks 17 e 18)
router.post("/:id/respostas", authMiddleware, async function (req, res) {
    const idExame = Number(req.params.id);
    const { id_questao, resposta, nota } = req.body;

    if (!id_questao || !resposta) {
        return res.status(400).json({ message: "id_questao e resposta são obrigatórios" });
    }

    if (!["a", "b", "c", "d"].includes(resposta.toLowerCase())) {
        return res.status(400).json({ message: "Resposta deve ser a, b, c ou d" });
    }

    try {
        const jaRespondida = await findRespostaByExameEQuestao(idExame, id_questao);
        if (jaRespondida && jaRespondida.resposta !== null) {
            return res.status(409).json({
                message: "Questão já respondida neste exame",
            });
        }

        const resultado = await inserirResposta(idExame, id_questao, resposta.toLowerCase(), nota);
        if (!resultado) {
            return res.status(404).json({ message: "Questão não encontrada neste exame" });
        }

        return res.status(200).json(resultado);
    } catch (e) {
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

// GET /api/exames/:id — consulta exame completo com questões para auditoria (RF10)
router.get("/:id", authMiddleware, async function (req, res) {
    const idExame = Number(req.params.id);

    try {
        const result = await require("../database/db").query(
            `SELECT e.id_exame, e.tentativa, e.id_modulo,
                    r.id_questao, r.resposta, r.nota, r.respondido_em
             FROM public.exames e
             JOIN public.respostas r ON r.id_exame = e.id_exame
             WHERE e.id_exame = $1
             ORDER BY r.id_resposta`,
            [idExame]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Exame não encontrado" });
        }

        return res.status(200).json(result.rows);
    } catch (e) {
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
});

module.exports = router;