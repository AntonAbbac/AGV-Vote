const pb = new PocketBase("http://10.220.25.193:8090"); // troca pelo seu IP

// LOGIN
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await pb.collection("users").authWithPassword(email, password);
        window.location.href = "index.html";
    } catch (err) {
        alert("Erro no login");
        console.log(err);
    }
}

// CADASTRO
async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await pb.collection("users").create({
            email: email,
            password: password,
            passwordConfirm: password
        });

        alert("Conta criada");
    } catch (err) {
        alert("Erro ao cadastrar");
        console.log(err);
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