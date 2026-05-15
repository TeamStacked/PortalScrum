form &&
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const valido = window.validarFormulario()

    if (!valido) return
    const data = {
      cpf: inputCPF.value,
      senha: inputPassword.value
    }

    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      alert(result.message)
      return
    }

    alert('Login realizado!')
    localStorage.setItem('token', result.token)

    // Sincroniza a sessão da API com o que o ScrumStore (Mock) espera
    localStorage.setItem(
      'scrum-user',
      JSON.stringify({
        name: result.nome,
        email: inputCPF.value, // Usando o CPF como identificador local
        profilePhoto: ''
      })
    )

    window.location.href = '/hub.html'
  })
