## Sumário

- [Autenticação (`/auth`)](#autenticação-auth)
- [Usuários (`/usuarios`)](#usuários-usuarios)
- [Questões / Exames (`/questoes`)](#questões-questoes)
- [Exames / Resultados (`/exames`)](#exames-exames)
- [Certificados (`/certificados`)](#certificados-certificados)
- [Regras de Negócio](#regras-de-negócio)
- [Códigos de Erro](#códigos-de-erro)

---

## Autenticação `/auth`

### `POST /api/auth/login`

Autentica um usuário e retorna um token JWT.

**Autenticação necessária:** Não

**Body (JSON):**

| Campo  | Tipo   | Obrigatório | Descrição             |
|--------|--------|-------------|-----------------------|
| `cpf`  | string | ✅           | CPF do usuário (11 dígitos, sem máscara) |
| `senha`| string | ✅           | Senha do usuário      |

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678900","senha":"123456"}'
```

**Resposta de sucesso `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "nome": "Ana Silva"
}
```

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Login realizado com sucesso |
| `400`  | CPF ou senha não informados |
| `401`  | CPF ou senha incorretos |
| `500`  | Erro interno do servidor |

---

### `POST /api/auth/logout`

Encerra a sessão do usuário. O frontend deve redirecionar para a página inicial.

**Autenticação necessária:** Não

**Body:** Nenhum

**Resposta de sucesso `200`:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso",
  "redirect": "/"
}
```

---

## Usuários `/usuarios`

### `POST /api/usuarios`

Cria um novo usuário. Ao ser criado, o sistema gera automaticamente um `certificado_hash` único vinculado ao usuário.

**Autenticação necessária:** Não

**Body (JSON):**

| Campo   | Tipo   | Obrigatório | Descrição                        |
|---------|--------|-------------|----------------------------------|
| `nome`  | string | ✅           | Nome completo                    |
| `email` | string | ✅           | E-mail (único no sistema)        |
| `cpf`   | string | ✅           | CPF com 11 dígitos (único)       |
| `senha` | string | ✅           | Senha (mínimo 6 caracteres)      |

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Silva","email":"ana@email.com","cpf":"12345678900","senha":"123456"}'
```

**Resposta de sucesso `201`:**
```json
{
  "id_usuario": 1,
  "nome": "Ana Silva",
  "email": "ana@email.com",
  "cpf": "12345678900",
  "certificado_hash": "a3f9c8..."
}
```

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `201`  | Usuário criado com sucesso |
| `400`  | Campos obrigatórios ausentes ou senha inválida |
| `409`  | CPF ou e-mail já cadastrado |
| `500`  | Erro interno do servidor |

---

### `GET /api/usuarios/me`

Retorna os dados do usuário autenticado.

**Autenticação necessária:** ✅ JWT

**Body:** Nenhum

**Exemplo de requisição:**
```bash
curl -X GET http://localhost:3000/api/usuarios/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta de sucesso `200`:**
```json
{
  "id_usuario": 1,
  "nome": "Ana Silva",
  "email": "ana@email.com",
  "cpf": "12345678900",
  "certificado_hash": "a3f9c8..."
}
```

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Dados retornados com sucesso |
| `401`  | Token não informado ou inválido |
| `404`  | Usuário não encontrado |
| `500`  | Erro interno do servidor |

---

### `PATCH /api/usuarios/cpf`

Atualiza o CPF do usuário autenticado.

**Autenticação necessária:** ✅ JWT

**Body (JSON):**

| Campo | Tipo   | Obrigatório | Descrição              |
|-------|--------|-------------|------------------------|
| `cpf` | string | ✅           | Novo CPF (11 dígitos, único) |

**Exemplo de requisição:**
```bash
curl -X PATCH http://localhost:3000/api/usuarios/cpf \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"cpf":"98765432100"}'
```

**Resposta de sucesso `200`:** Dados atualizados do usuário (mesmo formato do `GET /me`).

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | CPF atualizado com sucesso |
| `400`  | CPF não informado |
| `401`  | Token não informado ou inválido |
| `404`  | Usuário não encontrado |
| `409`  | CPF já pertence a outro usuário |
| `500`  | Erro interno do servidor |

---

### `PATCH /api/usuarios/nome`

Atualiza o nome do usuário autenticado.

**Autenticação necessária:** ✅ JWT

**Body (JSON):**

| Campo  | Tipo   | Obrigatório | Descrição   |
|--------|--------|-------------|-------------|
| `nome` | string | ✅           | Novo nome   |

**Exemplo de requisição:**
```bash
curl -X PATCH http://localhost:3000/api/usuarios/nome \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Souza"}'
```

**Resposta de sucesso `200`:** Dados atualizados do usuário.

**Códigos de resposta:** `200`, `400`, `401`, `404`, `500`

---

### `PATCH /api/usuarios/email`

Atualiza o e-mail do usuário autenticado.

**Autenticação necessária:** ✅ JWT

**Body (JSON):**

| Campo   | Tipo   | Obrigatório | Descrição             |
|---------|--------|-------------|-----------------------|
| `email` | string | ✅           | Novo e-mail (único)   |

**Exemplo de requisição:**
```bash
curl -X PATCH http://localhost:3000/api/usuarios/email \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"email":"ana.novo@email.com"}'
```

**Resposta de sucesso `200`:** Dados atualizados do usuário.

**Códigos de resposta:** `200`, `400`, `401`, `404`, `409`, `500`

---

### `PATCH /api/usuarios/senha`

Atualiza a senha do usuário autenticado.

**Autenticação necessária:** ✅ JWT

**Body (JSON):**

| Campo   | Tipo   | Obrigatório | Descrição                     |
|---------|--------|-------------|-------------------------------|
| `senha` | string | ✅           | Nova senha (mínimo 6 caracteres) |

**Exemplo de requisição:**
```bash
curl -X PATCH http://localhost:3000/api/usuarios/senha \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"senha":"654321"}'
```

**Resposta de sucesso `200`:** Dados atualizados do usuário.

**Códigos de resposta:** `200`, `400`, `401`, `404`, `500`

---

## Questões `/questoes`

### `POST /api/questoes/iniciar-modulo`

Inicia um novo exame para o módulo informado, ou retoma um exame em andamento caso já exista.

**Autenticação necessária:** ✅ JWT

**Body (JSON):**

| Campo       | Tipo    | Obrigatório | Descrição       |
|-------------|---------|-------------|-----------------|
| `id_modulo` | integer | ✅           | ID do módulo    |

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:3000/api/questoes/iniciar-modulo \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"id_modulo":1}'
```

**Resposta de sucesso `200`:**
```json
{
  "id_exame": 5,
  "id_modulo": 1,
  "tentativa": 1,
  "questoes": [
    {
      "id_questao": 10,
      "enunciado": "Qual é o conceito de...",
      "alternativa_a": "...",
      "alternativa_b": "...",
      "alternativa_c": "...",
      "alternativa_d": "...",
      "imagem": "/imagens/questoes/q10.png"
    }
  ]
}
```

> **Nota:** O campo `imagem` será `null` se a questão não possuir imagem.

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Exame criado ou retomado com sucesso |
| `400`  | `id_modulo` não informado |
| `401`  | Token não informado ou inválido |
| `403`  | Módulo bloqueado (pré-requisito não concluído) |
| `404`  | Módulo não encontrado |
| `409`  | Tentativas esgotadas para este módulo |
| `500`  | Erro interno do servidor |

---

### `GET /api/questoes/exame-atual`

Retorna o exame em andamento do usuário. Permite filtrar por módulo ou por ID de exame via query string.

**Autenticação necessária:** ✅ JWT

**Query Params (opcionais):**

| Parâmetro  | Tipo    | Descrição                         |
|------------|---------|-----------------------------------|
| `modulo`   | integer | Filtra pelo ID do módulo          |
| `id_exame` | integer | Busca um exame específico pelo ID |

**Exemplo de requisição:**
```bash
curl -X GET "http://localhost:3000/api/questoes/exame-atual?modulo=1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta de sucesso `200`:** Mesmo formato do `POST /iniciar-modulo`.

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Exame retornado com sucesso |
| `401`  | Token não informado ou inválido |
| `404`  | Nenhum exame em andamento encontrado |
| `500`  | Erro interno do servidor |

---

### `POST /api/questoes/responder`

Registra ou atualiza a resposta de uma questão dentro de um exame.

**Autenticação necessária:** ✅ JWT

**Body (JSON):**

| Campo       | Tipo    | Obrigatório | Descrição                              |
|-------------|---------|-------------|----------------------------------------|
| `id_exame`  | integer | ✅           | ID do exame                            |
| `id_questao`| integer | ✅           | ID da questão                          |
| `resposta`  | string  | ✅           | Alternativa escolhida: `"a"`, `"b"`, `"c"` ou `"d"` |

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:3000/api/questoes/responder \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"id_exame":1,"id_questao":10,"resposta":"a"}'
```

**Resposta de sucesso `201` (nova resposta) ou `200` (resposta atualizada):**
```json
{
  "id_resposta": 42,
  "id_exame": 1,
  "id_questao": 10,
  "resposta": "a",
  "nota_questao": 1,
  "proximo_estado": {
    "status": "modulo_aprovado",
    "id_exame": 1,
    "id_modulo": 1,
    "nota": 80
  }
}
```

**Campo `proximo_estado` — possíveis valores:**

| `status`           | Descrição                                               |
|--------------------|---------------------------------------------------------|
| `null`             | Exame ainda não concluído (restam questões a responder) |
| `modulo_aprovado`  | Nota ≥ 70 — módulo aprovado, próximo módulo desbloqueado |
| `modulo_concluido` | Nota < 70, mas ainda há tentativa disponível (`pode_tentar_novamente: true`) |
| `modulo_reprovado` | Nota < 70 e tentativas esgotadas (`tentativas_esgotadas: true`) |

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `201`  | Resposta registrada pela primeira vez |
| `200`  | Resposta atualizada |
| `400`  | Campos obrigatórios ausentes ou resposta inválida |
| `401`  | Token não informado ou inválido |
| `404`  | Exame ou questão não encontrada |
| `500`  | Erro interno do servidor |

---

### `PATCH /api/questoes/proxima-tentativa`

Cria uma nova tentativa para um módulo já finalizado (desde que o limite de 2 tentativas não tenha sido atingido).

**Autenticação necessária:** ✅ JWT

**Body (JSON):**

| Campo       | Tipo    | Obrigatório | Descrição                                   |
|-------------|---------|-------------|---------------------------------------------|
| `id_exame`  | integer | Condicional | ID do exame finalizado (se conhecido)       |
| `id_modulo` | integer | Condicional | ID do módulo (usado se `id_exame` não for informado) |

**Exemplo de requisição:**
```bash
curl -X PATCH http://localhost:3000/api/questoes/proxima-tentativa \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"id_exame":1}'
```

**Resposta de sucesso `200`:** Novo exame com lista de questões (mesmo formato do `POST /iniciar-modulo`).

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Nova tentativa criada com sucesso |
| `401`  | Token não informado ou inválido |
| `404`  | Nenhuma tentativa finalizada encontrada |
| `409`  | Tentativas esgotadas (máximo: 2) |
| `500`  | Erro interno do servidor |

---

### `GET /api/questoes/modulo-atual`

Retorna o módulo/exame que está atualmente em andamento para o usuário autenticado.

**Autenticação necessária:** ✅ JWT

**Body:** Nenhum

**Exemplo de requisição:**
```bash
curl -X GET http://localhost:3000/api/questoes/modulo-atual \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta de sucesso `200`:**
```json
{
  "id_exame": 5,
  "id_modulo": 2,
  "tentativa": 1
}
```

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Módulo atual retornado |
| `401`  | Token não informado ou inválido |
| `404`  | Nenhum exame em andamento |
| `500`  | Erro interno do servidor |

---

### `GET /api/questoes/exames`

Lista todos os módulos com seus respectivos status e tentativas do usuário autenticado.

**Autenticação necessária:** ✅ JWT

**Body:** Nenhum

**Exemplo de requisição:**
```bash
curl -X GET http://localhost:3000/api/questoes/exames \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta de sucesso `200`:**
```json
[
  {
    "id_modulo": 1,
    "nome_modulo": "Módulo 1",
    "tentativa": 2,
    "concluido": true,
    "aprovado": true
  }
]
```

**Códigos de resposta:** `200`, `401`, `500`

---

## Exames `/exames`

### `GET /api/exames`

Lista todos os módulos disponíveis com o status de desbloqueio para o usuário autenticado.

**Autenticação necessária:** ✅ JWT

**Body:** Nenhum

**Exemplo de requisição:**
```bash
curl -X GET http://localhost:3000/api/exames \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta de sucesso `200`:**
```json
[
  {
    "id_modulo": 1,
    "nome": "Módulo 1 — Introdução",
    "desbloqueado": true
  },
  {
    "id_modulo": 2,
    "nome": "Módulo 2 — Avançado",
    "desbloqueado": false
  }
]
```

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Lista de módulos retornada |
| `401`  | Token não informado ou inválido |
| `500`  | Erro interno do servidor |

---

### `GET /api/exames/resultado-atual`

Retorna o resultado da tentativa mais recente concluída do usuário. Permite filtrar por módulo ou por ID de exame.

**Autenticação necessária:** ✅ JWT

**Query Params (opcionais):**

| Parâmetro  | Tipo    | Descrição              |
|------------|---------|------------------------|
| `modulo`   | integer | Filtro por ID do módulo |
| `id_exame` | integer | Filtro por ID do exame  |

**Exemplo de requisição:**
```bash
curl -X GET "http://localhost:3000/api/exames/resultado-atual?modulo=1" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta de sucesso `200`:**
```json
{
  "id_exame": 5,
  "id_modulo": 1,
  "tentativa": 1,
  "nota": 80,
  "concluido": true,
  "aprovado": true,
  "total_questoes": 10,
  "total_acertos": 8
}
```

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Resultado retornado com sucesso |
| `401`  | Token não informado ou inválido |
| `404`  | Nenhum exame encontrado |
| `409`  | Tentativa ainda não finalizada |
| `500`  | Erro interno do servidor |

---

### `GET /api/exames/resultado/:idExame`

Retorna o resultado de um exame específico pelo seu ID.

**Autenticação necessária:** ✅ JWT

**Path Params:**

| Parâmetro  | Tipo    | Obrigatório | Descrição     |
|------------|---------|-------------|---------------|
| `idExame`  | integer | ✅           | ID do exame   |

**Exemplo de requisição:**
```bash
curl -X GET http://localhost:3000/api/exames/resultado/5 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta de sucesso `200`:** Mesmo formato do `GET /resultado-atual`.

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Resultado retornado com sucesso |
| `401`  | Token não informado ou inválido |
| `404`  | Exame não encontrado |
| `409`  | Tentativa ainda não finalizada |
| `500`  | Erro interno do servidor |

---

## Certificados `/certificados`

### `GET /api/certificados/hash/:hash`

Busca os dados de um certificado a partir do seu hash único. Esta rota é **pública** (não requer autenticação) e é utilizada para validar certificados emitidos.

**Autenticação necessária:** Não

**Path Params:**

| Parâmetro | Tipo   | Obrigatório | Descrição                     |
|-----------|--------|-------------|-------------------------------|
| `hash`    | string | ✅           | Hash único do certificado     |

**Exemplo de requisição:**
```bash
curl -X GET http://localhost:3000/api/certificados/hash/a3f9c8b2e1d04f7c...
```

**Resposta de sucesso `200`:**
```json
{
  "id_usuario": 1,
  "nome": "Ana Silva",
  "cpf": "12345678900",
  "certificado_hash": "a3f9c8b2e1d04f7c...",
  "progresso": { ... }
}
```

**Códigos de resposta:**

| Código | Descrição |
|--------|-----------|
| `200`  | Certificado encontrado e válido |
| `400`  | Hash não informado |
| `404`  | Certificado não encontrado para o hash informado |
| `409`  | Certificado indisponível (motivo retornado no corpo) |
| `500`  | Erro interno do servidor |

---

## Regras de Negócio

### Aprovação e Tentativas

- Cada módulo contém **10 questões** por tentativa.
- A **nota mínima de aprovação** é **70 pontos**.
- Cada usuário tem no máximo **2 tentativas** por módulo.
- Os módulos são **desbloqueados sequencialmente**: é necessário ser aprovado no módulo anterior para ter acesso ao próximo.

### Certificado

- O `certificado_hash` é gerado automaticamente no momento do cadastro do usuário.
- Ele é acessível publicamente via `GET /api/certificados/hash/:hash`, permitindo validação externa do certificado.
- A URL pública de visualização do certificado no frontend é: `/certificado/:hash`.

### Autenticação

- O token JWT pode ser enviado via **header** (`Authorization: Bearer <token>`) ou via **cookie** (`token`).
- Rotas protegidas retornam `401` quando o token está ausente ou inválido.

---

## Códigos de Erro

| Código | Significado              | Situações comuns |
|--------|--------------------------|-----------------|
| `400`  | Bad Request              | Campos obrigatórios ausentes, resposta inválida, senha curta |
| `401`  | Unauthorized             | Token ausente, inválido ou expirado |
| `403`  | Forbidden                | Módulo bloqueado (pré-requisito não concluído) |
| `404`  | Not Found                | Usuário, exame, módulo ou certificado não encontrado |
| `409`  | Conflict                 | CPF/e-mail duplicado, tentativas esgotadas, exame não finalizado |
| `500`  | Internal Server Error    | Erro inesperado no servidor |

---

## Visão Geral das Rotas

| Método   | Rota                                  | Auth | Descrição                           |
|----------|---------------------------------------|------|-------------------------------------|
| `POST`   | `/api/auth/login`                     | ❌    | Login do usuário                    |
| `POST`   | `/api/auth/logout`                    | ❌    | Logout do usuário                   |
| `POST`   | `/api/usuarios`                       | ❌    | Cadastro de novo usuário            |
| `GET`    | `/api/usuarios/me`                    | ✅    | Dados do usuário autenticado        |
| `PATCH`  | `/api/usuarios/cpf`                   | ✅    | Atualiza CPF                        |
| `PATCH`  | `/api/usuarios/nome`                  | ✅    | Atualiza nome                       |
| `PATCH`  | `/api/usuarios/email`                 | ✅    | Atualiza e-mail                     |
| `PATCH`  | `/api/usuarios/senha`                 | ✅    | Atualiza senha                      |
| `POST`   | `/api/questoes/iniciar-modulo`        | ✅    | Inicia ou retoma um módulo          |