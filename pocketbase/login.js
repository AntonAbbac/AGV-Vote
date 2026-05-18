const pb = new PocketBase("http://192.168.0.2:8090"); // troca pelo seu IP

// LOGIN
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;


    try {
        await pb.collection("users").authWithPassword(email, password, name);
        window.location.href = "home.html";
    } catch (err) {
        alert("Erro no login");
        console.log(err);
    }
}

// CADASTRO
async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;

        if (!email.endsWith("@escola.pr.gov.br")) {
      alert("Use um email institucional válido.");
      return;
    }

      const data = {
    email,
    password: senha,
    passwordConfirm: senha,
    nome,
    role: "aluno"
  };


  try {

    await pb.collection("users")
      .create(data);

    alert("Conta criada");

  } catch (erro) {

    console.log(erro);

    alert("Erro");

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
