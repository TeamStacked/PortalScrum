const { Router, json } = require("express");
const {
  createUsuario,
  updateUsuarioCpf,
  findUsuarioById,
} = require("../repositories/usuarios.repositories");

const router = Router();

router.post("/", async function (req, res) {});

router.patch("/:idUsuario/cpf", async function (req, res) {
  const idUsuario = getIdUsuario(req.params);

  if (!idUsuario) {
    return (res.status(400), json({ message: "id_usuario inválido" }));
  }

  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ message: "nome obrigatório" });
  }

  try {
    const result = await updateUsuarioCpf(idUsuario, cpf);
    if (!result) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    const usuario = await findUsuarioById(result.id_usuario);
    return res.status(200).json(usuario);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "Já existe usuário com o CPF informado",
      });
    }

    return res.status(409).json({
      message: "erro interno do servidor",
    });
  }
});

function getIdUsuario(params) {
  const idUsuario = Number(params.idUsuario);

  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return null;
  }

  return idUsuario;
}
