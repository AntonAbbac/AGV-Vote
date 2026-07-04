// LOGIN + AUTO-CADASTRO
// Tenta fazer login. Se o usuário não existir, cria automaticamente.
async function loginOrRegister(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email e senha são obrigatórios");
    return;
  }

  if (!email.endsWith("@escola.pr.gov.br")) {
    alert("Use um email institucional válido (@escola.pr.gov.br)");
    return;
  }

  if (password.length < 6) {
    alert("Senha deve ter no mínimo 6 caracteres");
    return;
  }

  try {
    // 1ª tentativa: login
    await pb.collection("users").authWithPassword(email, password);
    window.location.href = "home.html";
  } catch (loginErr) {
    // Se falhou, pode ser porque o usuário não existe → tenta criar
    console.log("Login falhou, tentando auto-cadastro...", loginErr);

    // Extrai o nome do email (ex: "joao.silva" de "joao.silva@escola.pr.gov.br")
    const nameFromEmail = email.split("@")[0].replace(/\./g, " ");
    // Capitaliza (ex: "joao silva" → "Joao Silva")
    const name = nameFromEmail
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const data = {
      email,
      password,
      passwordConfirm: password,
      name,
      role: "student", // role padrão para novos usuários
    };

    try {
      await pb.collection("users").create(data);
      // Agora faz login com a conta recém-criada
      await pb.collection("users").authWithPassword(email, password);
      window.location.href = "home.html";
    } catch (createErr) {
      console.log(createErr);
      const errorMsg =
        createErr.data?.message || createErr.message || "Erro ao acessar conta";
      alert("Erro: " + errorMsg);
    }
  }
}

// ESQUECI A SENHA
async function requestPasswordReset() {
  const email = document.getElementById("resetEmail").value.trim();

  if (!email) {
    alert("Digite seu email");
    return;
  }

  if (!email.endsWith("@escola.pr.gov.br")) {
    alert("Use um email institucional válido (@escola.pr.gov.br)");
    return;
  }

  try {
    await pb.collection("users").requestPasswordReset(email);
    alert("Link de redefinição enviado! Verifique seu email.");
    document.getElementById("resetModal").style.display = "none";
    document.getElementById("resetEmail").value = "";
  } catch (err) {
    console.log(err);
    const errorMsg = err.data?.message || err.message || "Erro ao enviar email";
    alert("Erro: " + errorMsg);
  }
}

// LOGOUT
function logout() {
  pb.authStore.clear();
  window.location.href = "login.html";
}

// PROTEÇÃO DE PÁGINA
function checkAuth() {
  if (!pb.authStore.isValid) {
    window.location.href = "login.html";
  }
}