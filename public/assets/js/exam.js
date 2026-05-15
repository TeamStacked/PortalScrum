(function () {
    var questionBank = [
        [
            "O que e Scrum?",
            [
                "Um framework para desenvolvimento de software",
                "Uma metodologia agil para gestao de projetos complexos",
                "Uma linguagem de programacao",
                "Uma ferramenta de tarefas",
            ],
            1,
        ],
        [
            "Quais sao os tres pilares do Scrum?",
            [
                "Planejamento, Execucao e Controle",
                "Transparencia, Inspecao e Adaptacao",
                "Analise, Design e Implementacao",
                "Sprint, Daily e Review",
            ],
            1,
        ],
        [
            "Qual e o papel do Scrum Master?",
            [
                "Gerenciar o time",
                "Definir funcionalidades",
                "Facilitar o Scrum e remover impedimentos",
                "Escrever codigo",
            ],
            2,
        ],
        [
            "O que e uma Sprint?",
            [
                "Uma reuniao diaria",
                "Um periodo fixo para gerar incremento",
                "Um documento",
                "Uma tecnica de estimativa",
            ],
            1,
        ],
        [
            "Quem e responsavel pelo Product Backlog?",
            [
                "Scrum Master",
                "Time de Desenvolvimento",
                "Product Owner",
                "Stakeholders",
            ],
            2,
        ],
        [
            "Qual e a duracao tipica de uma Daily Scrum?",
            ["5 minutos", "15 minutos", "30 minutos", "1 hora"],
            1,
        ],
        [
            "O que e um incremento?",
            [
                "Uma nova funcionalidade",
                "Soma dos itens completados que atendem a Definition of Done",
                "Um bug corrigido",
                "Uma documentacao",
            ],
            1,
        ],
        [
            "Qual evento ocorre ao final da Sprint?",
            [
                "Sprint Planning",
                "Daily Scrum",
                "Sprint Review e Sprint Retrospective",
                "Backlog Refinement",
            ],
            2,
        ],
        [
            "Qual e o tamanho ideal de um time Scrum?",
            [
                "3 a 5 pessoas",
                "5 a 9 pessoas",
                "10 a 15 pessoas",
                "Mais de 15 pessoas",
            ],
            1,
        ],
        [
            "O que define a Definition of Done?",
            [
                "Quando a Sprint termina",
                "Criterios para considerar um incremento completo",
                "A data de entrega",
                "Story points completados",
            ],
            1,
        ],
    ];
    var currentQuestion = 0;
    var answers = {};
    var timeLeft = 1800;
    var timerId = null;
    var moduleId = 1;
    function formatTime(seconds) {
        return (
            String(Math.floor(seconds / 60)).padStart(2, "0") +
            ":" +
            String(seconds % 60).padStart(2, "0")
        );
    }
    function updateHeader() {
        document.querySelector("[data-question-count]").textContent =
            "Questao " + (currentQuestion + 1) + " de " + questionBank.length;
        document.querySelector("[data-exam-progress]").style.width =
            ((currentQuestion + 1) / questionBank.length) * 100 + "%";
        document.querySelector("[data-timer]").textContent =
            formatTime(timeLeft);
    }
    function renderQuestion() {
        var question = questionBank[currentQuestion];
        var shell = document.querySelector("[data-question-shell]");
        shell.innerHTML =
            '<div class="eyebrow">Questao ' +
            (currentQuestion + 1) +
            "</div><h2>" +
            question[0] +
            '</h2><div class="answers">' +
            question[1]
                .map(function (option, index) {
                    return (
                        '<button class="answer-option ' +
                        (answers[currentQuestion] === index
                            ? "is-selected"
                            : "") +
                        '" data-answer="' +
                        index +
                        '"><span class="answer-radio" aria-hidden="true"></span><span>' +
                        option +
                        "</span></button>"
                    );
                })
                .join("") +
            "</div>";
        shell.querySelectorAll("[data-answer]").forEach(function (button) {
            button.addEventListener("click", function () {
                answers[currentQuestion] = Number(button.dataset.answer);
                renderQuestion();
                renderJumps();
            });
        });
        document.querySelector("[data-prev-question]").disabled =
            currentQuestion === 0;
        document
            .querySelector("[data-next-question]")
            .classList.toggle(
                "hidden",
                currentQuestion === questionBank.length - 1,
            );
        document
            .querySelector("[data-finish-exam]")
            .classList.toggle(
                "hidden",
                currentQuestion !== questionBank.length - 1,
            );
        document.querySelector("[data-finish-exam]").disabled =
            Object.keys(answers).length < questionBank.length;
        updateHeader();
    }
    function renderJumps() {
        var jumps = document.querySelector("[data-question-jumps]");
        jumps.innerHTML = questionBank
            .map(function (_, index) {
                return (
                    '<button class="jump-button ' +
                    (index === currentQuestion ? "is-current" : "") +
                    (answers[index] !== undefined ? " is-answered" : "") +
                    '" data-jump="' +
                    index +
                    '">' +
                    (index + 1) +
                    "</button>"
                );
            })
            .join("");
        jumps.querySelectorAll("[data-jump]").forEach(function (button) {
            button.addEventListener("click", function () {
                currentQuestion = Number(button.dataset.jump);
                renderQuestion();
                renderJumps();
            });
        });
    }
    function finishExam() {
        clearInterval(timerId);
        var correct = questionBank.reduce(function (total, question, index) {
            return total + (answers[index] === question[2] ? 1 : 0);
        }, 0);
        var grade = Math.round((correct / questionBank.length) * 100);
        var modules = ScrumStore.getModules();
        var index = modules.findIndex(function (module) {
            return module.id === moduleId;
        });
        if (index >= 0) {
            modules[index].tentativasUsadas += 1;
            modules[index].nota = grade;
            if (grade >= 70) {
                modules[index].status = "concluido";
                if (modules[index + 1])
                    modules[index + 1].status = "disponivel";
            }
            ScrumStore.saveModules(modules);
        }
        ScrumStore.saveResult({
            nota: grade,
            acertos: correct,
            total: questionBank.length,
            moduloId: moduleId,
        });
        window.location.href = "resultado.html";
    }
    document.addEventListener("DOMContentLoaded", function () {
        if (!ScrumStore.requireAuth()) return;
        moduleId = Number(
            new URLSearchParams(window.location.search).get("modulo") || 1,
        );
        document
            .querySelector("[data-prev-question]")
            .addEventListener("click", function () {
                if (currentQuestion > 0) {
                    currentQuestion--;
                    renderQuestion();
                    renderJumps();
                }
            });
        document
            .querySelector("[data-next-question]")
            .addEventListener("click", function () {
                if (currentQuestion < questionBank.length - 1) {
                    currentQuestion++;
                    renderQuestion();
                    renderJumps();
                }
            });
        document
            .querySelector("[data-finish-exam]")
            .addEventListener("click", finishExam);
        renderQuestion();
        renderJumps();
        timerId = setInterval(function () {
            timeLeft--;
            updateHeader();
            if (timeLeft <= 0) finishExam();
        }, 1000);
    });
})();
