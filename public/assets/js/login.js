form &&
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const valido = window.validarFormulario();

        if (!valido) return;
        const data = {
            cpf: inputCPF.value,
            senha: inputPassword.value,
        };

        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert("Login realizado!");
        localStorage.setItem("token", result.token);
        window.location.href = "/hub.html";
    });
