const ELECTION_ID = "2026"; // mude aqui para controlar eleições diferentes

async function initVotacao() {
  // 1. Protege a página
  if (!pb.authStore.isValid) {
    window.location.href = "login.html";
    return;
  }

  const userId = pb.authStore.model.id;

  // 2. Verifica se o usuário já votou nesta eleição
  try {
    const existingVotes = await pb.collection("votes").getList(1, 1, {
      filter: `user = "${userId}" && election_id = "${ELECTION_ID}"`,
    });

    if (existingVotes.totalItems > 0) {
      mostrarJaVotou();
      return;
    }
  } catch (err) {
    console.error("Erro ao verificar voto:", err);
  }

  // 3. Carrega as chapas do PocketBase
  try {
    const chapas = await pb.collection("chapas").getFullList({
      sort: "name",
    });
    renderizarChapas(chapas);
  } catch (err) {
    console.error("Erro ao carregar chapas:", err);
    document.getElementById("chapas-container").innerHTML =
      "<p>Erro ao carregar chapas. Tente novamente.</p>";
  }
}

function renderizarChapas(chapas) {
  const container = document.getElementById("chapas-container");
  container.innerHTML = "";

  chapas.forEach((chapa) => {
    // URL da imagem (se tiver campo de imagem no PocketBase)
    const imgUrl = chapa.imagem ? pb.files.getUrl(chapa, chapa.imagem) : null;

    const div = document.createElement("div");
    div.className = "chapa-card";
    div.innerHTML = `
      ${imgUrl ? `<img src="${imgUrl}" alt="${chapa.name}" />` : ""}
      <h2>${chapa.name}</h2>
      ${chapa.slogan ? `<p class="slogan">${chapa.slogan}</p>` : ""}
      <button onclick="votar('${chapa.id}', '${chapa.name}')">VOTAR!</button>
    `;
    container.appendChild(div);
  });
}

async function votar(chapaId, chapaNome) {
  const confirmou = confirm(
    `Tem certeza que deseja votar na "${chapaNome}"?\n\nEsta ação não pode ser desfeita.`,
  );
  if (!confirmou) return;

  const userId = pb.authStore.model.id;

  try {
    await pb.collection("votes").create({
      user: userId,
      chapa: chapaId,
      election_id: ELECTION_ID,
    });

    mostrarVotoRegistrado(chapaNome);
  } catch (err) {
    console.error("Erro ao registrar voto:", err);

    // Verifica se é erro de duplicata (caso a rule do PB bloqueie)
    if (err.status === 400) {
      alert("Você já votou nesta eleição.");
      mostrarJaVotou();
    } else {
      alert("Erro ao registrar seu voto. Tente novamente.");
    }
  }
}

function mostrarJaVotou() {
  const container = document.getElementById("chapas-container");
  container.innerHTML = `
    <div class="aviso">
      <h2>✅ Você já votou!</h2>
      <p>Seu voto já foi registrado nesta eleição.</p>
      <p>Obrigado por participar!</p>
    </div>
  `;
}

function mostrarVotoRegistrado(chapaNome) {
  const container = document.getElementById("chapas-container");
  container.innerHTML = `
    <div class="aviso">
      <h2>🎉 Voto registrado!</h2>
      <p>Você votou na <strong>${chapaNome}</strong>.</p>
      <p>Obrigado por participar da eleição do Grêmio Estudantil!</p>
    </div>
  `;
}
