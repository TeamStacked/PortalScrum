// Essa funcao valida se o token JWT existe e nao expirou
function tokenValido() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        localStorage.removeItem("token");
        return false;
    }
}

// Para paginas autenticadas (painel, perfil, etc.)
// Essa funcao garante que o usuario esteja autenticado para acessar a pagina
function requireAuth() {
    if (!tokenValido()) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
}

// Para paginas publicas (index, login, cadastro)
// Essa funcao garante que o usuario autenticado seja redirecionado para o hub
function requireGuest() {
    const autenticado = tokenValido();

    if (autenticado) {
        window.location.href = "/hub";
    }
}

// Essa funcao gera os cabecalhos de autenticacao com o token Bearer
function authHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

// Essa funcao realiza requisicoes HTTP com o token Bearer e trata expiracao
async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: authHeaders(),
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
    }

    return response;
}

// Função específica para logout
// Essa funcao limpa os dados locais e faz a requisicao de logout para o backend
async function logout() {
    try {
        const response = await apiFetch("/api/auth/logout", {
            method: "POST",
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.removeItem("token");
            window.location.href = result.redirect || "/login";
        } else {
            console.error("Erro ao fazer logout");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
}
