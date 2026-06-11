# Documentação da Sprint 3: Certificação e Dashboards

## Objetivo da Sprint

A Sprint 3 teve como foco a finalização do MVP da plataforma Portal Scrum, com ênfase na visualização de progresso do usuário, geração e validação pública de certificados, melhorias de arquitetura do back-end, responsividade e preparação final para entrega acadêmica.

---

# Planejamento da Sprint

## User Stories da Sprint

| User Story | Descrição                                                               | Issues                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US00       | Planejamento, documentação, qualidade e infraestrutura final do projeto | [#118](https://github.com/TeamStacked/PortalScrum/issues/118) [#119](https://github.com/TeamStacked/PortalScrum/issues/119) [#120](https://github.com/TeamStacked/PortalScrum/issues/120) [#126](https://github.com/TeamStacked/PortalScrum/issues/126) [#128](https://github.com/TeamStacked/PortalScrum/issues/128) [#136](https://github.com/TeamStacked/PortalScrum/issues/136) [#137](https://github.com/TeamStacked/PortalScrum/issues/137) [#138](https://github.com/TeamStacked/PortalScrum/issues/138) [#139](https://github.com/TeamStacked/PortalScrum/issues/139) [#140](https://github.com/TeamStacked/PortalScrum/issues/140) |
| US03       | Dashboard de progresso do usuário                                       | [#117](https://github.com/TeamStacked/PortalScrum/issues/117) [#121](https://github.com/TeamStacked/PortalScrum/issues/121) [#122](https://github.com/TeamStacked/PortalScrum/issues/122) [#125](https://github.com/TeamStacked/PortalScrum/issues/125) [#129](https://github.com/TeamStacked/PortalScrum/issues/129) [#133](https://github.com/TeamStacked/PortalScrum/issues/133) [#134](https://github.com/TeamStacked/PortalScrum/issues/134)                                                                                                                                                                                           |
| US06       | Sistema de certificados e validação pública                             | [#123](https://github.com/TeamStacked/PortalScrum/issues/123) [#124](https://github.com/TeamStacked/PortalScrum/issues/124) [#127](https://github.com/TeamStacked/PortalScrum/issues/127) [#130](https://github.com/TeamStacked/PortalScrum/issues/130) [#131](https://github.com/TeamStacked/PortalScrum/issues/131) [#132](https://github.com/TeamStacked/PortalScrum/issues/132) [#135](https://github.com/TeamStacked/PortalScrum/issues/135)                                                                                                                                                                                           |

---

# Desenvolvimento da Sprint

## US00 — Planejamento, documentação e qualidade

### Issues relacionadas

[X] — Indexação do Banco para Performance [#118](https://github.com/TeamStacked/PortalScrum/issues/118) @portug4lucas
[X] — Refatoração de Consistência JWT [#119](https://github.com/TeamStacked/PortalScrum/issues/119) @ThiagoDT
[X] — Refatorar arquitetura do back-end para padrão Controller/Service [#120](https://github.com/TeamStacked/PortalScrum/issues/120) @phjsilva
[X] — Middleware: Bloqueio de Login/Cadastro [#126](https://github.com/TeamStacked/PortalScrum/issues/126) @phjsilva
[X] — Carga de Dados Final (Seed Real) [#128](https://github.com/TeamStacked/PortalScrum/issues/128) @portug4lucas
[X] — Cleanup Final e Code Review [#136](https://github.com/TeamStacked/PortalScrum/issues/136) @phjsilva
[X] — Teste de Responsividade (RNF01) [#137](https://github.com/TeamStacked/PortalScrum/issues/137) @michelrubens
[X] — Atualização do Manual do Usuário [#138](https://github.com/TeamStacked/PortalScrum/issues/138) @michelrubens
[X] — Vídeo de Demonstração Final [#139](https://github.com/TeamStacked/PortalScrum/issues/139) @michelrubens @phjsilva
[X] — Planning e Relatório da Sprint 3 [#140](https://github.com/TeamStacked/PortalScrum/issues/140) @michelrubens

### O que foi desenvolvido

Durante esta etapa foram realizadas melhorias estruturais e de qualidade no sistema, incluindo:

- Refatoração da arquitetura do back-end utilizando o padrão Controller/Service;
- Padronização da autenticação JWT em todas as rotas protegidas;
- Implementação de middleware para impedir acesso às páginas de login/cadastro por usuários autenticados;
- Criação de índices SQL para otimização das consultas de progresso;
- Revisão final de código e limpeza de logs/debug;
- Testes de responsividade em dispositivos móveis;
- Atualização da documentação do projeto;
- Preparação do vídeo de demonstração final do sistema;
- Organização e documentação do encerramento da Sprint.

### Critérios de aceite atingidos

- APIs funcionando após refatoração;
- Rotas protegidas utilizando validação JWT consistente;
- Sistema responsivo em dispositivos móveis;
- Banco de dados otimizado;
- Manual atualizado;
- Repositório revisado e organizado.

---

## US03 — Dashboard de progresso do usuário

### Issues relacionadas

[X] — Prototipagem do Dashboard [#117](https://github.com/TeamStacked/PortalScrum/issues/117) @ViniciusGuin
[X] — HTML/CSS do Dashboard do Usuário [#121](https://github.com/TeamStacked/PortalScrum/issues/121) @phjsilva
[X] — Lógica de Cálculo de Progresso (RF11) [#122](https://github.com/TeamStacked/PortalScrum/issues/122) @Victorhubb
[X] — Gráfico de Progresso (JS Puro) [#125](https://github.com/TeamStacked/PortalScrum/issues/125) @ViniciusGuin
[X] — Rota API `GET /api/progresso` [#129](https://github.com/TeamStacked/PortalScrum/issues/129) @Victorhubb
[X] — Integração Front-end Dashboard [#133](https://github.com/TeamStacked/PortalScrum/issues/133) @Victorhubb
[X] — Integração Link para Certificado [#134](https://github.com/TeamStacked/PortalScrum/issues/134) @Victorhubb

### O que foi desenvolvido

Foi implementado o dashboard do usuário, responsável por exibir o progresso dentro da plataforma.

As funcionalidades incluem:

- Tela responsiva baseada no protótipo desenvolvido no Figma;
- Exibição dos níveis concluídos e bloqueados;
- Barras de progresso dinâmicas utilizando JavaScript puro;
- Integração com API de progresso;
- Exibição das tentativas restantes por nível;
- Habilitação do botão de geração de certificado apenas para usuários aprovados.

### Critérios de aceite atingidos

- Dashboard exibindo dados reais do banco;
- Integração completa entre front-end e back-end;
- Progresso exibido dinamicamente;
- Interface responsiva;
- Regras de aprovação funcionando corretamente.

---

## US06 — Sistema de Certificados

### Issues relacionadas

[X] — Cálculo da Média Final (RF08) [#123](https://github.com/TeamStacked/PortalScrum/issues/123) @ThiagoDT
[X] — Design do Certificado (Template) [#124](https://github.com/TeamStacked/PortalScrum/issues/124) @ViniciusGuin
[X] — Lógica de Geração de Hash Único [#127](https://github.com/TeamStacked/PortalScrum/issues/127) @ThiagoDT
[X] — Validação de Emissão de Certificado [#130](https://github.com/TeamStacked/PortalScrum/issues/130) @portug4lucas
[X] — Rota Pública `GET /certificado/:hash` [#131](https://github.com/TeamStacked/PortalScrum/issues/131) @ThiagoDT
[X] — HTML/CSS do Certificado (Impressão) [#132](https://github.com/TeamStacked/PortalScrum/issues/132) @ViniciusGuin
[X] — Lógica de Geração PDF/Print View [#135](https://github.com/TeamStacked/PortalScrum/issues/135) @portug4lucas

### O que foi desenvolvido

Foi desenvolvido o sistema completo de emissão e validação de certificados da plataforma.

As funcionalidades incluem:

- Cálculo da média final do usuário;
- Geração de hash único para autenticação do certificado;
- Validação no back-end para impedir emissão indevida;
- Rota pública para acesso ao certificado sem login;
- Página de certificado formatada para impressão/PDF;
- Integração entre dados do banco e template visual do certificado.

### Critérios de aceite atingidos

- Certificados gerados apenas para usuários aprovados;
- Certificados acessíveis publicamente via URL única;
- Layout pronto para impressão;
- Dados exibidos corretamente;
- Segurança validada no back-end.

# Burndown da Sprint

[Burndown Chart](./burndown_chart_sprint_3.png)

# Retrospectiva da Sprint

## Pontos positivos

- Boa divisão de tarefas entre os integrantes;
- Integração eficiente entre front-end e back-end;
- Evolução significativa da arquitetura do sistema;
- Conclusão do MVP.

## Pontos de melhoria

- Quebra em tasks muito pequenas;
- Dificuldade em testar tasks pequenas por falta de contexto;
- Execução sem querer de mais de uma issue dentro de outra.

---

# Integrantes e Responsabilidades

| Integrante    | Responsabilidades                                       |
| ------------- | ------------------------------------------------------- |
| @michelrubens | Planejamento, documentação, responsividade, vídeo final |
| @ViniciusGuin | Dashboard, gráficos e design do certificado             |
| @Victorhubb   | APIs de progresso e integrações do dashboard            |
| @ThiagoDT     | Certificados, hash único, autenticação JWT              |
| @phjsilva     | Front-end dashboard, middleware e refatoração back-end  |
| @portug4lucas | Banco de dados, validações e performance                |

---

# Links

## Repositório

- https://github.com/TeamStacked/PortalScrum

## Sprint 3

- https://github.com/TeamStacked/PortalScrum/tree/develop/docs/sprint-3

## Issues da Sprint

- https://github.com/TeamStacked/PortalScrum/issues?q=is%3Aissue%20milestone%3A%22Sprint%203%22%20no%3Alabel

## Vídeo de Demonstração

- Inserir link do YouTube

## Manual do Usuário

- [Manual do usuário](https://github.com/TeamStacked/PortalScrum/blob/develop/docs/manual-do-usuario.md)
