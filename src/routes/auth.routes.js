const { Router } = require("express");
const { findUsuarioByCpfAndSenha } = require("../repositories/usuarios.repositories");

const router = Router();

router.post("/login", async function (req, res) {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res
            .status(400)
            .json({ message: "CPF e senha são obrigatórios." });
    }

    try {
        const result = await findUsuarioByCpfAndSenha(cpf, senha);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            message: e.message,
        });
    }
});

module.exports = router;