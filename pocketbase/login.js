

// LOGIN
async function login(event) {
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

  try {
    await pb.collection("users").authWithPassword(email, password);
    window.location.href = "home.html";
  } catch (err) {
    console.log(err);
    alert("Email ou senha incorretos");
  }
}

// CADASTRO
async function register(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value;

  if (!email || !password || !name) {
    alert("Todos os campos são obrigatórios");
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

  if (!["student", "leader", "admin"].includes(role)) {
    alert("Função inválida");
    return;
  }

  const data = {
    email,
    password,
    passwordConfirm: password,
    name,
    role,
  };

  try {
    await pb.collection("users").create(data);
    alert("Conta criada com sucesso! Faça login para continuar.");
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("name").value = "";
    document.getElementById("role").value = "student";

    // Volta para modo login
    document.getElementById("toggleBtn").click();
  } catch (erro) {
    console.log(erro);
    const errorMsg =
      erro.data?.message || erro.message || "Erro ao criar conta";
    alert("Erro ao criar conta: " + errorMsg);
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
