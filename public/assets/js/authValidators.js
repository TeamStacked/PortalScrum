const inputEmail = document.getElementById("email");
const inputCPF = document.getElementById("cpf");
const form = document.getElementById("form");

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

if (!validarEmail()) {
    console.log("erro");
} else {
    console.log("certo");
}
