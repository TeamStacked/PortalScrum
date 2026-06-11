const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const router = Router();
/*
POST /api/auth/login
Como testar:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"cpf\":\"12345678900\",\"senha\":\"123456\"}"
Payload esperado: { "cpf": "12345678900", "senha": "123456" }
Resposta 200: { "token": "jwt", "nome": "Nome do aluno" }
Codigos possiveis: 200, 400, 401, 500
*/
router.post("/login", authController.login);

/*
MÉTODO POST /api/auth/logout
Como testar:
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
Payload esperado: nenhum.
Resposta 200: { "success": true, "message": "Logout realizado com sucesso", "redirect": "/" }
Codigos possiveis: 200, 401, 500
*/
router.post("/logout", authController.logout);

module.exports = router;