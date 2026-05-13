const { Router } = require("express");
const usuario = require("./usuario.routes");
const auth = require("./auth.routes");
const exame = require("./exame.routes");
//const questao= require("./questoes.routes");

const router = Router();

router.use("/usuarios", usuario);
router.use("/auth", auth);
router.use("/exames", exame);
//router.use("/questoes", questao);

router.use(function (req, res) {
    res.status(404).json({ message: "Rota inexistente" });
});

module.exports = router;