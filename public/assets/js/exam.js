;(function () {
  let questaoAtual = null
  let currentQuestion = 0
  let totalQuestoes = 10

  let timeLeft = 1800
  let timerId = null

  // ─────────────────────────────────────────────
  // Utils
  // ─────────────────────────────────────────────
  function formatTime(seconds) {
    return (
      String(Math.floor(seconds / 60)).padStart(2, '0') +
      ':' +
      String(seconds % 60).padStart(2, '0')
    )
  }

  function updateHeader() {
    document.querySelector('[data-question-count]').textContent =
      `Questão ${Math.min(currentQuestion + 1, totalQuestoes)} de ${totalQuestoes}`

    document.querySelector('[data-exam-progress]').style.width =
      `${(currentQuestion / totalQuestoes) * 100}%`

    // document.querySelector('[data-timer]').textContent = formatTime(timeLeft)
  }

  // ─────────────────────────────────────────────
  // Renderizar questão
  // ─────────────────────────────────────────────
  function renderQuestion() {
    if (!questaoAtual) return

    const shell = document.querySelector('[data-question-shell]')

    shell.innerHTML = `
      <div class="eyebrow">
        Questão ${currentQuestion + 1}
      </div>

      <h2>${questaoAtual.enunciado}</h2>

      ${
        questaoAtual.imagem
          ? `
            <img
              src="${questaoAtual.imagem}"
              class="question-image"
              alt="Imagem da questão"
            />
          `
          : ''
      }

      <div class="answers">
        ${['a', 'b', 'c', 'd']
          .map((letra) => {
            const texto = questaoAtual[`alternativa_${letra}`]

            if (!texto) return ''

            return `
              <button
                class="answer-option"
                data-answer="${letra}"
              >
                <span class="answer-radio"></span>
                <span>${texto}</span>
              </button>
            `
          })
          .join('')}
      </div>
    `

    shell.querySelectorAll('[data-answer]').forEach((button) => {
      button.addEventListener('click', async function () {
        const letraSelecionada = button.dataset.answer

        // evita múltiplos cliques
        shell.querySelectorAll('[data-answer]').forEach((btn) => {
          btn.disabled = true
        })

        button.classList.add('is-selected')

        await responderQuestao(letraSelecionada)
      })
    })

    updateHeader()
  }

  // ─────────────────────────────────────────────
  // Buscar próxima questão
  // ─────────────────────────────────────────────
  async function carregarQuestao() {
    try {
      const res = await apiFetch('/api/questoes/proxima-questao')

      if (!res) return

      // terminou prova
      if (res.status === 404) {
        finalizarAvaliacao()
        return
      }

      const questao = await res.json()

      questaoAtual = questao

      renderQuestion()
    } catch (err) {
      console.error('Erro ao carregar questão:', err)

      mostrarErro('Não foi possível carregar a próxima questão.')
    }
  }

  // ─────────────────────────────────────────────
  // Responder questão
  // ─────────────────────────────────────────────
  async function responderQuestao(letraSelecionada) {
    try {
      const res = await apiFetch('/api/questoes/responder', {
        method: 'POST',
        body: JSON.stringify({
          id_exame: questaoAtual.id_exame,
          id_questao: questaoAtual.id_questao,
          resposta: letraSelecionada
        })
      })

      if (!res) return

      const data = await res.json()

      console.log('Resposta registrada:', data)

      currentQuestion++

      updateHeader()

      // pequena pausa visual
      setTimeout(async () => {
        await carregarQuestao()
      }, 500)
    } catch (err) {
      console.error('Erro ao responder questão:', err)

      mostrarErro('Erro ao registrar resposta.')
    }
  }

  // ─────────────────────────────────────────────
  // Finalizar avaliação
  // ─────────────────────────────────────────────
  function finalizarAvaliacao() {
    clearInterval(timerId)

    document.querySelector('[data-question-shell]').innerHTML = `
      <div class="exam-finished">
        <h2>Avaliação concluída!</h2>
        <p>
          Suas respostas foram registradas com sucesso.
        </p>

        <button
          class="primary-button"
          onclick="window.location.href='resultado.html'"
        >
          Ver Resultado
        </button>
      </div>
    `

    document.querySelector('[data-exam-progress]').style.width = '100%'

    document.querySelector('[data-question-count]').textContent =
      'Avaliação concluída'
  }

  // ─────────────────────────────────────────────
  // Erro
  // ─────────────────────────────────────────────
  function mostrarErro(msg) {
    document.querySelector('[data-question-shell]').innerHTML = `
      <div class="exam-error">
        <h2>Erro</h2>
        <p>${msg}</p>
      </div>
    `
  }

  // ─────────────────────────────────────────────
  // Timer
  // ─────────────────────────────────────────────
  function iniciarTimer() {
    timerId = setInterval(() => {
      timeLeft--

      updateHeader()

      if (timeLeft <= 0) {
        clearInterval(timerId)

        finalizarAvaliacao()
      }
    }, 1000)
  }

  // ─────────────────────────────────────────────
  // Init
  // ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', async function () {
    updateHeader()

    iniciarTimer()

    await carregarQuestao()
  })
})()
