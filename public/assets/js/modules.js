(function () {
    var selectedModuleId = null;
    function remaining(module) {
        return module.tentativas - module.tentativasUsadas;
    }
    function statusLabel(status) {
        return {
            bloqueado: "Bloqueado",
            disponivel: "Disponivel",
            concluido: "Concluido",
        }[status];
    }
    function renderModules() {
        var modules = ScrumStore.getModules();
        var list = document.querySelector("[data-modules-list]");
        var complete = modules.filter(function (module) {
            return module.status === "concluido";
        }).length;
        var progress = modules.length ? (complete / modules.length) * 100 : 0;
        document.querySelector("[data-module-count]").textContent =
            complete + "/" + modules.length + " Modulos";
        document.querySelector("[data-module-progress]").style.width =
            progress + "%";
        list.innerHTML = modules
            .map(function (module) {
                var left = remaining(module);
                var exhausted =
                    left === 0 && module.nota !== null && module.nota < 70;
                var stateClass =
                    module.status === "bloqueado"
                        ? "is-locked"
                        : module.status === "concluido"
                          ? "is-complete"
                          : "is-available";
                var badgeClass =
                    module.status === "concluido"
                        ? "badge-success"
                        : module.status === "disponivel"
                          ? "badge-primary"
                          : "badge-muted";
                var symbol =
                    module.status === "concluido"
                        ? "OK"
                        : module.status === "disponivel"
                          ? "GO"
                          : "NO";
                return (
                    '<article class="card module-card ' +
                    stateClass +
                    (exhausted ? " is-exhausted" : "") +
                    '" data-module-id="' +
                    module.id +
                    '">' +
                    '<div class="module-main"><div class="module-icon" aria-hidden="true">' +
                    symbol +
                    "</div><div><h2>" +
                    module.nome +
                    '</h2><p class="muted">' +
                    module.descricao +
                    "</p>" +
                    '<div class="module-meta"><span class="badge ' +
                    badgeClass +
                    '">' +
                    statusLabel(module.status) +
                    "</span>" +
                    (module.status !== "bloqueado"
                        ? '<span class="badge badge-muted">' +
                          left +
                          " tentativa" +
                          (left === 1 ? "" : "s") +
                          "</span>"
                        : "") +
                    (module.nota !== null
                        ? '<span class="badge ' +
                          (module.nota >= 70
                              ? "badge-success"
                              : "badge-danger") +
                          '">Nota: ' +
                          module.nota +
                          "%</span>"
                        : "") +
                    "</div></div></div>" +
                    (exhausted
                        ? '<div class="alert alert-error is-visible">Tentativas esgotadas. Voce nao atingiu a nota minima de 70%.</div>'
                        : "") +
                    "</article>"
                );
            })
            .join("");
        list.querySelectorAll("[data-module-id]").forEach(function (card) {
            card.addEventListener("click", function () {
                var module = modules.find(function (item) {
                    return item.id === Number(card.dataset.moduleId);
                });
                if (!module || module.status === "bloqueado") return;
                if (module.nota !== null && module.nota >= 70)
                    return openModal(module, true);
                if (remaining(module) > 0) openModal(module, false);
            });
        });
    }
    function openModal(module, isRedo) {
        selectedModuleId = module.id;
        document.querySelector("[data-modal-title]").textContent = isRedo
            ? "Refazer Prova?"
            : "Iniciar Prova";
        document.querySelector("[data-modal-body]").innerHTML = isRedo
            ? "Voce ja foi aprovado neste modulo com nota <strong>" +
              module.nota +
              "%</strong>. Deseja refazer a prova?"
            : "Voce tem <strong>" +
              remaining(module) +
              " tentativa(s)</strong> restante(s). A nota minima para aprovacao e 70%.";
        document.querySelector("[data-modal-confirm]").textContent = isRedo
            ? "Refazer"
            : "Iniciar Prova";
        document
            .querySelector("[data-module-modal]")
            .classList.add("is-visible");
    }
    function closeModal() {
        document
            .querySelector("[data-module-modal]")
            .classList.remove("is-visible");
    }
    document.addEventListener("DOMContentLoaded", function () {
        if (!ScrumStore.requireAuth()) return;
        renderModules();
        document
            .querySelector("[data-modal-cancel]")
            .addEventListener("click", closeModal);
        document
            .querySelector("[data-module-modal]")
            .addEventListener("click", function (event) {
                if (event.target.matches("[data-module-modal]")) closeModal();
            });
        document
            .querySelector("[data-modal-confirm]")
            .addEventListener("click", function () {
                window.location.href = "exame.html?modulo=" + selectedModuleId;
            });
    });
})();