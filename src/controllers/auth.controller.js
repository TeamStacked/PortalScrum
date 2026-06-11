const { loginUsuario, logoutUsuario } = require('../services/auth.service')
const { sendErrorResponse } = require('./error-response')

async function login(req, res) {
  try {
    const result = await loginUsuario(req.body, res)
    return res.status(200).json(result)
  } catch (error) {
    return sendErrorResponse(res, error, 'Erro interno do servidor.')
  }
}
async function logout(req, res) {
  try {
    await logoutUsuario(res)
    return res.redirect('/login.html')
  } catch (e) {
    return sendErrorResponse(res, e, 'Erro interno do servidor.')
  }
}

module.exports = {
  logout,
  login
}
