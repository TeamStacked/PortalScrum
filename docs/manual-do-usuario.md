# Manual do Usuário - Portal Scrum (Stacked)

## 1. Introdução e Propósito do Portal

Seja bem-vindo ao Portal Scrum (Stacked), uma plataforma de certificação moderna e completa, desenvolvida especificamente para profissionais e estudantes que desejam dominar o framework Scrum. Este projeto, fruto de uma iniciativa da FATEC Jacareí, resolve a dificuldade de consolidar conceitos fundamentais — como papéis, rituais e artefatos — por meio de uma jornada gamificada e estruturada.

O portal permite que você meça sua evolução em tempo real, avançando por níveis de dificuldade crescente para conquistar uma certificação reconhecida. Sinta-se encorajado a iniciar esta jornada e validar suas competências em metodologias ágeis de forma prática e segura.

## 2. Primeiros Passos: Cadastro e Acesso

O acesso ao sistema foi projetado para ser intuitivo e seguro, utilizando tecnologias modernas de autenticação para proteger seu progresso.

### 2.1 Crie sua Conta

Para iniciar sua jornada, realize seu cadastro preenchendo o formulário ilustrado na imagem [SOURCE_IMAGE_6]. Insira as seguintes informações obrigatórias:

- **Nome Completo**: Utilize seu nome oficial, pois ele constará no certificado final.
- **CPF**: Seu identificador único no sistema.
- **E-mail**: Seu endereço de contato para registros.
- **Senha**: Sua chave de acesso pessoal e intransferível.

### 2.2 Acesse o Sistema

Faça o login exclusivamente através do seu CPF e Senha na tela de entrada ([SOURCE_IMAGE_7]). O portal utiliza a tecnologia `JWT (JSON Web Token)`, o que garante uma sessão segura e estável: uma vez logado, você não precisará realizar o acesso novamente se atualizar a página, garantindo uma melhor experiência de uso (UX).

### 2.3 Segurança de Acesso

Como medida de segurança e para evitar conflitos de sessão, o sistema possui redirecionamento inteligente. Se você já estiver autenticado e tentar acessar as páginas de login ou cadastro, o portal o levará automaticamente para o Hub Principal, impedindo cadastros duplicados desnecessários.

## 3. O Hub Principal: Sua Central de Comando

Ao entrar, você encontrará o seu Hub Principal ([SOURCE_IMAGE_8]), o ponto de partida para todas as atividades. Explore os elementos da interface:

- **Cabeçalho**: No canto superior direito, você tem acesso rápido ao botão Dashboard e ao seu Avatar de Usuário (M) para gestão de perfil.
- **Card "Fazer Prova"**: Clique em Começar agora -> para iniciar ou continuar seus exames de nível.
- **Card "Material de Estudo"**: Espaço reservado para conteúdos de apoio (disponível em breve).
- **Widgets de Resumo**: Visualize rapidamente seu Progresso Geral (barra de porcentagem), o contador de Módulos Concluídos (ex: 5/5) e sua Melhor Nota global.

Responsividade: Sinta-se à vontade para acessar o portal de qualquer lugar. A interface é totalmente responsiva, adaptando-se perfeitamente a computadores, tablets e smartphones.

## 4. A Jornada de Certificação: Módulos e Níveis

Sua evolução ocorre em 5 níveis de dificuldade. Conforme demonstrado na imagem [SOURCE_IMAGE_9], cada nível é representado por um card que muda para a cor verde e exibe o status `CONCLUÍDO` assim que você atinge o objetivo.

1. **Fundamentos das Metodologias Ágeis**: Introdução aos conceitos básicos.
2. **Scrum: Estrutura, Papéis e Artefatos**: Scrum Master, Product Owner e Time.
3. **Eventos do Scrum e Fluxo de Trabalho**: Sprints e rituais.
4. **Práticas Ágeis, Métricas e Qualidade**: Backlogs e critérios de qualidade.
5. **Aplicação Prática, Cenários e Análise Crítica**: Desafios de cenários reais.

Os cards também informam a quantidade de tentativas usadas e a melhor nota obtida em cada etapa.

## 5. Realizando a Avaliação: Regras e Funcionamento

As provas validam seu conhecimento técnico com rigor e imparcialidade, seguindo as diretrizes do framework Scrum.

### 5.1 Dinâmica e Navegação

Cada exame sorteia 10 questões de um banco de 30, garantindo um mix equilibrado de dificuldades: 3 fáceis, 4 médias e 3 difíceis. Na tela de prova ([SOURCE_IMAGE_10]), utilize os comandos:

- Selecione uma das alternativas.
- Clique em Próxima questão para avançar.
- Utilize Voltar questão caso deseje revisar uma resposta anterior antes da submissão final.

### 5.2 Limites de Tentativas

Você tem direito a no máximo 2 tentativas por nível. O sistema é inteligente e salvará automaticamente apenas a sua maior nota entre as duas tentativas, garantindo que seu melhor desempenho seja o que conta para a média final.

### 5.3 Feedback de Conclusão

Ao finalizar, a tela de resultado ([SOURCE_IMAGE_11]) exibe um ícone verde de OK, o percentual de acerto com uma barra de progresso destacando a marca de 70%, e a contagem de acertos e erros. A partir daqui, você pode escolher Voltar aos módulos ou Ver dashboard.

## 6. Acompanhamento de Progresso (Dashboard)

Acesse o Dashboard ([SOURCE_IMAGE_12] e [SOURCE_IMAGE_13]) para uma análise detalhada da sua performance.

| Indicador         | Importância para o Usuário                                 |
| ----------------- | ---------------------------------------------------------- |
| Módulos Completos | Indica quantos dos 5 níveis foram finalizados.             |
| Melhor Nota       | Valor oficial utilizado para o cálculo do seu certificado. |
| Última Nota       | Registro histórico do seu exame mais recente.              |
| Média Geral       | Média consolidada das melhores notas de cada nível.        |

**Importante**: Na seção Tasks para Emissão do Certificado, você deve atingir o critério de Média geral de 70% ou superior para habilitar a emissão do documento.

## 7. Emissão e Autenticidade do Certificado

### 7.1 Critérios e Emissão (RF08, RF09)

O botão Emitir Meu Certificado será liberado apenas quando todos os 5 módulos estiverem com status CONCLUÍDO e a média final for igual ou superior a 70%.

### 7.2 O Certificado Profissional (RF09)

O documento gerado ([SOURCE_IMAGE_14]) registra sua jornada completa, incluindo:

- Nome, CPF e E-mail.
- O período da sua jornada (ex: 15/05/26 a 09/06/26).
- Média final e a nota específica de cada um dos 5 níveis para máxima transparência.

### 7.3 Validação e Auditoria

Para garantir a integridade da sua conquista, o certificado conta com um Hash de autenticidade único e um QR Code. Esses elementos permitem que empresas e recrutadores validem a veracidade do seu certificado em uma página pública, sem a necessidade de login, reforçando o valor profissional da sua certificação.

## 8. Suporte e Boas Práticas

- LGPD: Seus dados pessoais são tratados com total segurança e privacidade, seguindo as normas legais vigentes.
- Iniciativa: Este portal é um projeto da FATEC Jacareí, desenvolvido com tecnologias puras (HTML, CSS e JavaScript) e PostgreSQL para garantir robustez e performance.

Domine o framework, complete seus módulos e conquiste sua certificação Scrum hoje mesmo!
