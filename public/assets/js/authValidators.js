const inputEmail = document.getElementById("email");
const inputCPF = document.getElementById("cpf");
const form = document.getElementById("form");

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mascaraCPF(cpf) {
    return cpf
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
}

inputCPF.addEventListener("input", (e) => {
    e.target.value = mascaraCPF(e.target.value);
});

form.addEventListener("submit", (e) => {
    if (inputEmail && !validarEmail(inputEmail.value)) {
        e.preventDefault();
        alert("Email inválido");
        return;
    }

    if (inputCPF && !validarCPF(inputCPF.value)) {
        e.preventDefault();
        alert("CPF inválido");
        return;
    }
});
