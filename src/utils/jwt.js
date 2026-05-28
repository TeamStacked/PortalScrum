const path = require("path");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, "..", "..", ".env"),
});

function createToken(payload, res) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.DEFAULT_EXPIRES_IN_SECONDS),
    });
    //O token apaga apos o fechamento do navegador
    res.cookie('token',token, {httpOnly: true, secure: false, sameSite: 'strict', maxAge:process.env.DEFAULT_EXPIRES_IN_SECONDS*1000});
    return token;
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    createToken,
    verifyToken,
};
