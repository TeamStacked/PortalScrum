(function () {
    var THEME_KEY = "scrum-theme";
    var LOGO_BY_THEME = {
        dark: "../assets/images/logoBranca.png",
        light: "../assets/images/logoEscuro.png",
    };

// Essa funcao busca a preferencia de tema no localStorage
    function getTheme() {
        return localStorage.getItem(THEME_KEY) || "dark";
    }

// Essa funcao define a preferencia de tema e altera o dataset
    function setTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
        document.documentElement.dataset.theme = theme;
    }

// Essa funcao atualiza a logo da marca correspondente ao tema atual
    function applyBrandLogos(theme) {
        var logoSrc = LOGO_BY_THEME[theme] || LOGO_BY_THEME.dark;
        document.querySelectorAll(".brand-logo").forEach(function (img) {
            img.src = logoSrc;
        });
    }

// Essa funcao aplica o tema ativo na pagina e altera o icone
    function applyTheme() {
        var theme = getTheme();
        document.documentElement.dataset.theme = theme;
        document.querySelectorAll("[data-theme-icon]").forEach(function (element) {
            element.textContent = theme === "dark" ? "🌞" : "🌑";
        });
        applyBrandLogos(theme);
    }

// Essa funcao alterna o tema entre claro e escuro
    function toggleTheme() {
        var current = document.documentElement.dataset.theme || "dark";
        setTheme(current === "dark" ? "light" : "dark");
        applyTheme();
    }

    document.addEventListener("DOMContentLoaded", function () {
        applyTheme();
        document.querySelectorAll("[data-action='toggle-theme']").forEach(function (button) {
            button.addEventListener("click", toggleTheme);
        });
    });
})();