const { verifyToken } = require("../utils/jwt");
const { findUsuarioById } = require("../repositories");


async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;


  if (!authorization) {
    return res.status(401).json({ message: "Token não informado" });
  }


  const [type, token] = authorization.split(" ");


  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token inválido" });
  }
  try {
    const payLoad = verifyToken(token);


    const usuario = await findUsuarioById(payLoad.id_usuario);
    if (!usuario) {
      return res.status(401).json({ message: "Usuário não identificado" });
    }


    req.usuario = usuario;


    return next();
  } catch (e) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}


module.exports = authMiddleware;

