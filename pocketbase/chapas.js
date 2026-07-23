async function initChapas() {
  try {
    const chapas = await pb.collection("chapas").getFullList({ sort: "name", });
    renderizarChapas(chapas);
  }
  catch (err) {
    console.error("Erro ao carregar chapas:", err);
    document.getElementById("chapas-container").innerHTML = "<p>Erro ao carregar chapas. Tente novamente.</p>";
  }
}

function renderizarChapas(chapas) {
  const container = document.getElementById("chapas-container");
  container.innerHTML = "";

  chapas.forEach((chapa) => {
    const imgUrl = chapa.imagem ? pb.files.getUrl(chapa, chapa.imagem) : null;

    // ===== AQUI ESTÁ A DIFERENÇA: mostramos as PROPOSTAS =====
    let propostasHtml = "";
    if (chapa.proposals) {
      // Se for um texto (string)
      if (typeof chapa.proposals === "string") {
        propostasHtml = `
          <div class="propostas">
            <h3>Propostas</h3>
            <p>${escapeHtml(chapa.proposals)}</p>
          </div>`;
      }
      // Se for uma lista (array)
      else if (Array.isArray(chapa.proposals)) {
        const lista = chapa.proposals
          .map(p => `<li>${escapeHtml(p)}</li>`)
          .join("");
        propostasHtml = `
          <div class="propostas">
            <h3>Propostas</h3>
            <ul>${lista}</ul>
          </div>`;
      }
    }

    const div = document.createElement("div");
    div.className = "chapa-card";
    div.innerHTML = `
      ${imgUrl ? `<img src="${imgUrl}" alt="${escapeHtml(chapa.name)}" />` : ""}
      <h2>${escapeHtml(chapa.name)}</h2>
      ${chapa.slogan ? `<p class="slogan">"${escapeHtml(chapa.slogan)}"</p>` : ""}
      ${propostasHtml}
      <a href="./votacao.html" class="btn-votar">Ir votar →</a>
    `;
    container.appendChild(div);
  });
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;  // O navegador escapa automaticamente
  return div.innerHTML;
}
