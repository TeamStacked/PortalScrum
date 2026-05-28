const { verifyToken } = require("../utils/jwt");
const { findUsuarioById } = require("../repositories/usuario.repositories");

async function authMiddleware(req, res, next) {
    const cookie = req.cookies?.token;

    if (!cookie) {
        return res.status(401).json({ message: "token não informado" });
    }
    try {
        const payload = verifyToken(cookie);

        const usuario = await findUsuarioById(payload.id_usuario);
        if (!usuario) {
            return res
                .status(401)
                .json({ message: "usuário não identificado" });
        }

        req.usuario = usuario;

        return next();
    } catch (e) {
        return res.status(401).json({ message: "token inválido ou expirado" });
    }
}

async function BlockAuthMiddleware(req, res, next) {
    const cookie = req.cookies?.token;
    console.log(cookie)
    if (!cookie) {
        return next()
    }
    try {
        const token = verifyToken(cookie)
        console.log(verifyToken(cookie));
        if(!token){
            return next()
        }
        return res.redirect('/hub.html');
        
    } catch (e) {
        console.log(e.message)

        return res.redirect('/index.html');
    }
}

module.exports = {
    authMiddleware,
    BlockAuthMiddleware
};
