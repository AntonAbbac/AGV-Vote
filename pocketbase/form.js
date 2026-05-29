const pb = new PocketBase("http://10.220.27.139:8090");

// 2. Proteção de Página: Verifica se o usuário pode estar aqui
function permissionverify() {
  // Se não estiver logado
  if (!pb.authStore.isValid) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html"; // Manda de volta
    return;
  }

  // Pega os dados do usuário logado
  const registreduser = pb.authStore.model;

  // Se NÃO for líder E NÃO for admin, barra o acesso
  if (registreduser.role !== "leader" && registreduser.role !== "admin") {
    alert("Apenas líderes de chapa podem cadastrar novas chapas.");
    window.location.href = "chapas.html";
  }
}

// Executa a verificação assim que o script carrega
permissionverify();

// 3. Captura o envio do formulário
const form = document.getElementById("form");

form.addEventListener("submit", async (event) => {
  // Evita que a página recarregue ao enviar o formulário
  event.preventDefault();

  // Pega os valores digitados nos inputs
  const name = document.getElementById("name").value;
  const slogan = document.getElementById("slogan").value;
  const proposals = document.getElementById("proposals").value;

  // Pega o ID do usuário que está logado criando a chapa
  const userId = pb.authStore.model.id;

  // Monta o objeto com os dados para enviar ao banco
  const data = {
    name: name,
    slogan: slogan,
    proposals: proposals,
    createdby: userId, // Vincula a chapa ao líder logado
  };

  try {
    // Envia para a collection 'chapas'
    await pb.collection("chapas").create(data);

    alert("Chapa cadastrada com sucesso!");

    // Redireciona para a página principal para ver a lista atualizada
    window.location.href = "chapas.html";
  } catch (erro) {
    console.error("Erro ao criar chapa:", erro);
    alert(
      "Erro ao cadastrar a chapa. Verifique se preencheu tudo corretamente.",
    );
  }
});
