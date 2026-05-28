const { loginUsuario } = require('../services/auth.service')
const { sendErrorResponse } = require('./error-response')

async function login(req, res) {
  try {
    const result = await loginUsuario(req.body, res)
    return res.status(200).json(result)
  } catch (error) {
    return sendErrorResponse(res, error, 'Erro interno do servidor.')
  }
}

module.exports = {
  login
}