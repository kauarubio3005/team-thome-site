"use strict";

/*
 * TEAM THOMÉ — GRADE DE AULAS
 *
 * Cada aula contém:
 * [horário, turma, professor, observação opcional]
 *
 * Estrutura atual: um tatame.
 * Kids 02 e Kids 03 dividem o espaço às segundas e quartas.
 * Sexta às 19:00: aula Kids unificada de rolas.
 */

(function () {
  const gradeAulas = [
    {
      dia: "Segunda-feira",
      nomeCurto: "Segunda",
      identificador: "segunda",
      aulas: [
        ["07:00", "Adulto", "Thomé"],
        ["11:30", "Avançado", "Parceria"],
        ["17:00", "Fundamentos", "Thomé"],
        ["18:30", "Kids 01", "Zero Um"],
        ["19:00", "Kids 02", "Zero Um", "Tatame dividido com Kids 03."],
        ["19:00", "Kids 03", "Braz", "Tatame dividido com Kids 02."],
        ["20:00", "Iniciantes", "Zero Um"],
        ["21:00", "Intermediário", "Rony"]
      ]
    },
    {
      dia: "Terça-feira",
      nomeCurto: "Terça",
      identificador: "terca",
      aulas: [
        ["06:00", "Iniciantes", "Thomé"],
        ["07:00", "Adulto", "Thomé"],
        ["17:00", "Fundamentos", "Thomé"],
        [
          "18:45",
          "No Gi",
          "Thomé",
          "Sem kimono. Não há empréstimo de uniforme; consulte a equipe sobre a roupa adequada."
        ],
        ["20:00", "Iniciantes", "Zero Um"],
        ["21:00", "Intermediário", "Braz"]
      ]
    },
    {
      dia: "Quarta-feira",
      nomeCurto: "Quarta",
      identificador: "quarta",
      aulas: [
        ["07:00", "Adulto", "Thomé"],
        ["11:30", "Avançado", "Parceria"],
        ["17:00", "Fundamentos", "Thomé"],
        ["18:30", "Kids 01", "Zero Um"],
        ["19:00", "Kids 02", "Zero Um", "Tatame dividido com Kids 03."],
        ["19:00", "Kids 03", "Braz", "Tatame dividido com Kids 02."],
        ["20:00", "Iniciantes", "Zero Um"],
        ["21:00", "Intermediário", "Rony"]
      ]
    },
    {
      dia: "Quinta-feira",
      nomeCurto: "Quinta",
      identificador: "quinta",
      aulas: [
        ["06:00", "Iniciantes", "Thomé"],
        ["07:00", "Adulto", "Thomé"],
        ["17:00", "Fundamentos", "Thomé"],
        [
          "18:45",
          "No Gi",
          "Thomé",
          "Sem kimono. Não há empréstimo de uniforme; consulte a equipe sobre a roupa adequada."
        ],
        ["20:00", "Iniciantes", "Zero Um"],
        ["21:00", "Intermediário", "Braz"]
      ]
    },
    {
      dia: "Sexta-feira",
      nomeCurto: "Sexta",
      identificador: "sexta",
      aulas: [
        [
          "07:00",
          "No Gi",
          "Thomé",
          "Sem kimono. Não há empréstimo de uniforme; consulte a equipe sobre a roupa adequada."
        ],
        ["11:30", "Avançado", "Parceria"],
        ["17:00", "Fundamentos", "Thomé"],
        [
          "19:00",
          "Kids — aula unificada de rolas",
          "Braz",
          "Kids 01, Kids 02 e Kids 03 juntos. Para a primeira participação da criança, consulte a equipe."
        ],
        ["20:00", "Adulto", "Diego"]
      ]
    },
    {
      dia: "Sábado",
      nomeCurto: "Sábado",
      identificador: "sabado",
      aulas: [
        ["09:00", "Adulto", "Diego"]
      ]
    }
  ];

  // Cria elementos sem interpretar o texto como HTML.
  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
      elemento.className = classe;
    }

    if (texto !== undefined) {
      elemento.textContent = texto;
    }

    return elemento;
  }

  // Mede o cabeçalho para não esconder seções e filtros.
  function atualizarAlturaCabecalho() {
    const cabecalho = document.querySelector(".cabecalho");
    const altura = cabecalho
      ? Math.ceil(cabecalho.getBoundingClientRect().height)
      : 0;

    document.documentElement.style.setProperty(
      "--altura-cabecalho",
      `${altura + 16}px`
    );
  }

  function iniciarAjusteCabecalho() {
    atualizarAlturaCabecalho();

    const cabecalho = document.querySelector(".cabecalho");

    if (cabecalho && "ResizeObserver" in window) {
      const observador = new ResizeObserver(atualizarAlturaCabecalho);
      observador.observe(cabecalho);
    }

    window.addEventListener("resize", atualizarAlturaCabecalho);
  }

  function criarItemAula(aula) {
    const [horario, turma, professor, observacao] = aula;

    const item = criarElemento("li", "item-aula");

    const hora = criarElemento("time", "hora-aula", horario);
    hora.setAttribute("datetime", horario);

    const detalhes = criarElemento("div", "detalhes-aula");
    const nome = criarElemento("span", "nome-aula", turma);

    const responsavel = criarElemento(
      "p",
      "professor-aula",
      professor === "Parceria"
        ? "Responsável: Parceria"
        : `Professor: ${professor}`
    );

    detalhes.append(nome, responsavel);

    if (observacao) {
      detalhes.append(
        criarElemento("p", "observacao-aula", observacao)
      );
    }

    item.append(hora, detalhes);

    return item;
  }

  function criarCartaoDia(dia) {
    const cartao = criarElemento("article", "cartao-dia");
    cartao.dataset.dia = dia.identificador;

    const cabecalho = criarElemento("header", "cabecalho-dia");

    // A programação tem um título h2; cada dia utiliza h3.
    const titulo = criarElemento("h3", "", dia.dia);
    titulo.id = `titulo-${dia.identificador}`;

    cartao.setAttribute("aria-labelledby", titulo.id);
    cabecalho.append(titulo);

    const lista = criarElemento("ul", "lista-aulas");

    dia.aulas.forEach(function (aula) {
      lista.append(criarItemAula(aula));
    });

    cartao.append(cabecalho, lista);

    return cartao;
  }

  function rolarParaProgramacao() {
    const filtros = document.getElementById("filtros-dias");

    if (!filtros) {
      return;
    }

    atualizarAlturaCabecalho();

    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    filtros.scrollIntoView({
      behavior: movimentoReduzido ? "instant" : "smooth",
      block: "start"
    });
  }

  function filtrarDia(identificador, moverTela = false) {
    const grade = document.getElementById("grade-horarios");
    const filtros = document.getElementById("filtros-dias");
    const resultado = document.getElementById("resultado-filtro");

    if (!grade || !filtros || !resultado) {
      return;
    }

    const semanaCompleta = identificador === "todos";

    const diaSelecionado = gradeAulas.find(function (dia) {
      return dia.identificador === identificador;
    });

    if (!semanaCompleta && !diaSelecionado) {
      return;
    }

    grade.querySelectorAll(".cartao-dia").forEach(function (cartao) {
      cartao.hidden =
        !semanaCompleta &&
        cartao.dataset.dia !== identificador;
    });

    filtros.querySelectorAll(".botao-dia").forEach(function (botao) {
      botao.setAttribute(
        "aria-pressed",
        String(botao.dataset.dia === identificador)
      );
    });

    grade.classList.toggle("dia-selecionado", !semanaCompleta);

    resultado.textContent = semanaCompleta
      ? "Exibindo os horários da semana completa."
      : `Exibindo os horários de ${diaSelecionado.dia.toLowerCase()}.`;

    // Não move a tela ao abrir a página.
    if (moverTela) {
      requestAnimationFrame(rolarParaProgramacao);
    }
  }

  function criarBotaoDia(texto, identificador, selecionado) {
    const botao = criarElemento("button", "botao-dia", texto);

    botao.type = "button";
    botao.dataset.dia = identificador;
    botao.setAttribute("aria-pressed", String(selecionado));
    botao.setAttribute("aria-controls", "grade-horarios");

    botao.addEventListener("click", function () {
      filtrarDia(identificador, true);
    });

    return botao;
  }

  function iniciarGrade() {
    const grade = document.getElementById("grade-horarios");
    const filtros = document.getElementById("filtros-dias");
    const resultado = document.getElementById("resultado-filtro");

    if (!grade || !filtros || !resultado) {
      return;
    }

    grade.replaceChildren();
    filtros.replaceChildren();

    filtros.append(
      criarBotaoDia("Semana completa", "todos", true)
    );

    gradeAulas.forEach(function (dia) {
      grade.append(criarCartaoDia(dia));

      filtros.append(
        criarBotaoDia(dia.nomeCurto, dia.identificador, false)
      );
    });

    filtros.hidden = false;
    filtrarDia("todos");
  }

  function iniciarPagina() {
    iniciarAjusteCabecalho();
    iniciarGrade();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarPagina);
  } else {
    iniciarPagina();
  }
})();