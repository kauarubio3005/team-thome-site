"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const listaPerfis = document.querySelector(".professores-perfis");

  if (!listaPerfis) {
    return;
  }

  const perfis = Array.from(
    listaPerfis.querySelectorAll(".professor-perfil")
  );

  if (perfis.length === 0) {
    return;
  }

  let perfilAtual = 0;

  const navegacao = document.createElement("nav");
  navegacao.className = "navegacao-professores";
  navegacao.setAttribute("aria-label", "Navegação entre professores");

  const botaoAnterior = document.createElement("button");
  botaoAnterior.type = "button";
  botaoAnterior.className = "navegacao-professores-anterior";
  botaoAnterior.textContent = "Professor anterior";

  const indicador = document.createElement("p");
  indicador.className = "navegacao-professores-indicador";
  indicador.setAttribute("aria-live", "polite");
  indicador.setAttribute("aria-atomic", "true");

  const seletores = document.createElement("div");
  seletores.className = "navegacao-professores-seletores";

  const botaoProximo = document.createElement("button");
  botaoProximo.type = "button";
  botaoProximo.className = "navegacao-professores-proximo";
  botaoProximo.textContent = "Próximo professor";

  const botoesPerfis = perfis.map((perfil, indice) => {
    const titulo = perfil.querySelector("h2");
    const nome = titulo ? titulo.textContent.trim() : `Professor ${indice + 1}`;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "navegacao-professores-seletor";
    botao.textContent = nome;
    botao.setAttribute("aria-label", `Ver perfil de ${nome}`);
    botao.addEventListener("click", () => mostrarPerfil(indice));

    seletores.appendChild(botao);

    return botao;
  });

  navegacao.append(
    botaoAnterior,
    indicador,
    seletores,
    botaoProximo
  );

  listaPerfis.before(navegacao);

  function mostrarPerfil(indice) {
    perfilAtual = (indice + perfis.length) % perfis.length;

    perfis.forEach((perfil, posicao) => {
      const estaAtivo = posicao === perfilAtual;

      perfil.hidden = !estaAtivo;
      botoesPerfis[posicao].setAttribute(
        "aria-current",
        estaAtivo ? "true" : "false"
      );
    });

    const nomeAtual = perfis[perfilAtual]
      .querySelector("h2")
      ?.textContent.trim();

    indicador.textContent =
      `${perfilAtual + 1} de ${perfis.length}: ${nomeAtual}`;

    botaoAnterior.disabled = perfis.length < 2;
    botaoProximo.disabled = perfis.length < 2;
  }

  botaoAnterior.addEventListener("click", () => {
    mostrarPerfil(perfilAtual - 1);
  });

  botaoProximo.addEventListener("click", () => {
    mostrarPerfil(perfilAtual + 1);
  });

  mostrarPerfil(perfilAtual);
});