const path = require('path')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, '..', '..', '.env')
})

// Gera e assina o token JWT com JWT_SECRET e validade definida em expiresIn
function createToken(payload, res) {
  const expiresInSeconds =
    Number(process.env.DEFAULT_EXPIRES_IN_SECONDS) || 3600

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresInSeconds
  })

  if (res) {
    res.cookie('token', token, {
      httpOnly: true, // Impede acesso via JavaScript (Segurança)
      secure: false, // Mantenha false para localhost (HTTP). Se usar HTTPS, mude para true.
      sameSite: 'lax', // Necessário para navegação moderna
      maxAge: expiresInSeconds * 1000 // Converte segundos para milissegundos
    })
  }

  return token
}

// Valida a assinatura e a expiração do token
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

function deletarToken(res) {
  res.clearCookie('token', { path: '/' })
}

module.exports = {
  createToken,
  verifyToken,
  deletarToken
}
