"use strict";

(function () {
  const whatsappEquipe = "5511930290784";

  const orientacaoNoGi =
    "No Gi não utiliza kimono, e a academia não empresta uniforme para essa modalidade. Traga sua própria roupa de treino e consulte a equipe sobre a roupa adequada.";

  const programacao = {
    iniciantes: {
      nome: "Iniciantes",
      descricao:
        "Aula aberta a todos os níveis, inclusive para quem nunca treinou jiu-jítsu.",
      dias: {
        segunda: ["20:00"],
        terca: ["06:00", "20:00"],
        quarta: ["20:00"],
        quinta: ["06:00", "20:00"]
      }
    },

    fundamentos: {
      nome: "Fundamentos",
      descricao:
        "Treino de posições, movimentações e técnicas essenciais do jiu-jítsu. Aberto a todos os níveis.",
      dias: {
        segunda: ["17:00"],
        terca: ["17:00"],
        quarta: ["17:00"],
        quinta: ["17:00"],
        sexta: ["17:00"]
      }
    },

    adulto: {
      nome: "Adulto",
      descricao:
        "Treino para adultos iniciantes e graduados, aberto a todos os níveis. Segunda a quinta às 07:00, sexta somente às 20:00 e sábado às 09:00.",
      dias: {
        segunda: ["07:00"],
        terca: ["07:00"],
        quarta: ["07:00"],
        quinta: ["07:00"],
        sexta: ["20:00"],
        sabado: ["09:00"]
      }
    },

    intermediario: {
      nome: "Intermediário",
      descricao:
        "Treino para aprofundar as técnicas do jiu-jítsu. Consulte a equipe sobre os critérios de participação.",
      dias: {
        segunda: ["21:00"],
        terca: ["21:00"],
        quarta: ["21:00"],
        quinta: ["21:00"]
      }
    },

    avancado: {
      nome: "Avançado",
      descricao:
        "Turma Avançado de jiu-jítsu. Consulte a equipe sobre a proposta do treino e os critérios de participação.",
      dias: {
        segunda: ["11:30"],
        quarta: ["11:30"],
        sexta: ["11:30"]
      }
    },

    "no-gi": {
      nome: "No Gi",
      descricao:
        "Treino sem kimono e sem divisão por nível. A academia não empresta uniforme para essa modalidade. Consulte a equipe sobre a roupa adequada para participar.",
      dias: {
        terca: ["18:45"],
        quinta: ["18:45"],
        sexta: ["07:00"]
      }
    },

    "kids-01": {
      nome: "Kids 01 — 3 a 6 anos",
      descricao:
        "Turma para crianças de 3 a 6 anos. Segunda e quarta às 18:30; sexta às 19:00, na aula unificada de rolas. Para crianças de 6 anos, consulte a equipe sobre a turma indicada.",
      dias: {
        segunda: ["18:30"],
        quarta: ["18:30"],
        sexta: ["19:00"]
      }
    },

    "kids-02": {
      nome: "Kids 02 — 6 a 10 anos",
      descricao:
        "Turma para crianças de 6 a 10 anos. Segunda e quarta às 19:00, dividindo o tatame com Kids 03, com um professor para cada turma. Sexta às 19:00, na aula unificada de rolas. Para crianças de 6 ou 10 anos, consulte a equipe.",
      dias: {
        segunda: ["19:00"],
        quarta: ["19:00"],
        sexta: ["19:00"]
      }
    },

    "kids-03": {
      nome: "Kids 03 — 10 a 14 anos",
      descricao:
        "Turma para crianças de 10 a 14 anos. Segunda e quarta às 19:00, dividindo o tatame com Kids 02, com um professor para cada turma. Sexta às 19:00, na aula unificada de rolas. Para crianças de 10 anos, consulte a equipe.",
      dias: {
        segunda: ["19:00"],
        quarta: ["19:00"],
        sexta: ["19:00"]
      }
    }
  };

  const diasDaSemana = {
    segunda: "Segunda-feira",
    terca: "Terça-feira",
    quarta: "Quarta-feira",
    quinta: "Quinta-feira",
    sexta: "Sexta-feira",
    sabado: "Sábado"
  };

  function iniciar() {
    const formulario = document.getElementById("formulario-experimental");
    const turma = document.getElementById("turma");
    const dia = document.getElementById("dia");
    const horario = document.getElementById("horario");
    const contato = document.getElementById("contato-whatsapp");
    const nome = document.getElementById("nome-completo");
    const telefone = document.getElementById("telefone");
    const kimono = document.getElementById("kimono");
    const etapaKimono = document.getElementById("etapa-kimono");
    const linhaResumoKimono = document.getElementById("linha-resumo-kimono");
    const avisoSexta = document.getElementById("aviso-kids-sexta");

    const camposObrigatorios = [
      formulario,
      turma,
      dia,
      horario,
      contato,
      nome,
      telefone,
      kimono,
      etapaKimono,
      linhaResumoKimono
    ];

    if (camposObrigatorios.some(function (campo) {
      return !campo;
    })) {
      console.error(
        "Aula experimental: faltam elementos na página. Use o HTML atualizado com os campos de identificação e kimono."
      );
      return;
    }

    // A validação é executada no evento de envio.
    // Isso permite verificar todos os campos antes de abrir o WhatsApp.
    formulario.noValidate = true;

    nome.required = true;
    telefone.required = true;
    turma.required = true;
    dia.required = true;
    horario.required = true;
    contato.required = true;

    // Mantém somente o contato oficial da equipe.
    contato.replaceChildren(
      new Option("(11) 93029-0784", whatsappEquipe)
    );
    contato.value = whatsappEquipe;

    turma.replaceChildren(new Option("Selecione uma opção", ""));

    Object.keys(programacao).forEach(function (chave) {
      turma.add(new Option(programacao[chave].nome, chave));
    });

    function escrever(id, texto) {
      const elemento = document.getElementById(id);

      if (elemento) {
        elemento.textContent = texto;
      }
    }

    function obterTurma() {
      return Object.prototype.hasOwnProperty.call(programacao, turma.value)
        ? programacao[turma.value]
        : null;
    }

    function infantil() {
      return turma.value.startsWith("kids-");
    }

    function noGi() {
      return turma.value === "no-gi";
    }

    function limpar(campo, texto) {
      campo.replaceChildren(new Option(texto, ""));
      campo.disabled = true;
      campo.setCustomValidity("");
    }

    function atualizarIdentificacao() {
      escrever(
        "rotulo-nome",
        infantil()
          ? "Nome completo da criança que vai participar"
          : "Nome completo de quem vai participar"
      );

      escrever(
        "rotulo-telefone",
        infantil()
          ? "Telefone do responsável com DDD"
          : "Telefone de contato com DDD"
      );

      escrever(
        "orientacao-identificacao",
        infantil()
          ? "O responsável deve informar o nome completo da criança e seu telefone de contato."
          : "Informe o nome completo de quem vai participar e um telefone de contato."
      );

      nome.placeholder = infantil()
        ? "Digite o nome completo da criança"
        : "Digite o nome completo";

      nome.autocomplete = infantil() ? "off" : "name";
    }

    function atualizarCampoKimono() {
      const usaKimono = Boolean(obterTurma()) && !noGi();

      // Reinicia a escolha ao mudar de turma.
      kimono.replaceChildren(
        new Option("Selecione uma opção", ""),
        new Option(
          infantil()
            ? "A criança precisa de um kimono experimental"
            : "Preciso de um kimono experimental",
          "preciso"
        ),
        new Option(
          infantil()
            ? "A criança já tem kimono e vai levar o próprio"
            : "Já tenho kimono e vou levar o meu",
          "proprio"
        )
      );

      kimono.setCustomValidity("");
      kimono.disabled = !usaKimono;
      kimono.required = usaKimono;

      etapaKimono.hidden = !usaKimono;
      linhaResumoKimono.hidden = !usaKimono;

      escrever(
        "numero-etapa-contato",
        usaKimono ? "05" : "04"
      );

      escrever(
        "rotulo-kimono",
        infantil() ? "Kimono da criança para a aula" : "Kimono para a aula"
      );

      escrever(
        "orientacao-kimono",
        infantil()
          ? "Se a criança precisar, entregamos um kimono experimental na chegada para usar durante a aula. Se já tiver kimono, pode trazer o próprio."
          : "Se precisar, entregamos um kimono experimental na sua chegada para usar durante a aula. Se já tiver kimono, pode trazer o seu."
      );
    }

    function atualizarOrientacaoRoupa() {
      if (noGi()) {
        escrever("orientacao-roupa", orientacaoNoGi);
        return;
      }

      if (kimono.value === "preciso") {
        escrever(
          "orientacao-roupa",
          infantil()
            ? "Entregamos um kimono experimental na chegada para a criança usar durante a aula."
            : "Entregamos um kimono experimental na sua chegada para usar durante a aula."
        );
        return;
      }

      if (kimono.value === "proprio") {
        escrever(
          "orientacao-roupa",
          infantil()
            ? "Traga o kimono próprio da criança para a aula."
            : "Traga seu próprio kimono para a aula."
        );
        return;
      }

      escrever(
        "orientacao-roupa",
        "Para aulas com kimono, você pode trazer o seu ou usar um kimono experimental, entregue na chegada. No Gi não utiliza kimono e não tem empréstimo de uniforme."
      );
    }

    function atualizarResumo() {
      const selecionada = obterTurma();

      escrever(
        "resumo-turma",
        selecionada ? selecionada.nome : "Ainda não selecionada"
      );

      escrever(
        "resumo-dia",
        diasDaSemana[dia.value] || "Ainda não selecionado"
      );

      escrever(
        "resumo-horario",
        horario.value || "Ainda não selecionado"
      );

      const textosKimono = {
        preciso: "Kimono experimental",
        proprio: "Vai levar kimono próprio"
      };

      escrever(
        "resumo-kimono",
        textosKimono[kimono.value] || "Ainda não selecionado"
      );

      if (avisoSexta) {
        avisoSexta.hidden = !(infantil() && dia.value === "sexta");
      }

      atualizarOrientacaoRoupa();
    }

    function atualizarDias() {
      limpar(dia, "Escolha a turma primeiro");
      limpar(horario, "Escolha o dia primeiro");

      atualizarIdentificacao();
      atualizarCampoKimono();

      const selecionada = obterTurma();

      if (!selecionada) {
        escrever("nome-turma", "Conheça sua turma");

        escrever(
          "descricao-turma",
          "Selecione uma turma para conhecer o treino e as orientações de participação."
        );

        atualizarResumo();
        return;
      }

      escrever("nome-turma", selecionada.nome);
      escrever("descricao-turma", selecionada.descricao);

      limpar(dia, "Selecione o dia");

      Object.keys(diasDaSemana).forEach(function (chave) {
        if (Object.prototype.hasOwnProperty.call(selecionada.dias, chave)) {
          dia.add(new Option(diasDaSemana[chave], chave));
        }
      });

      dia.disabled = false;
      atualizarResumo();
    }

    function atualizarHorarios() {
      limpar(horario, "Escolha o dia primeiro");

      const selecionada = obterTurma();
      const horarios = selecionada
        ? selecionada.dias[dia.value]
        : null;

      if (!Array.isArray(horarios)) {
        atualizarResumo();
        return;
      }

      limpar(horario, "Selecione o horário");

      horarios.forEach(function (valor) {
        horario.add(new Option(valor, valor));
      });

      horario.disabled = false;

      if (horarios.length === 1) {
        horario.value = horarios[0];
      }

      atualizarResumo();
    }

    function nomeLimpo() {
      return nome.value.trim().replace(/\s+/g, " ");
    }

    function telefoneLimpo() {
      let numero = telefone.value.replace(/\D/g, "");

      if (
        numero.startsWith("55") &&
        (numero.length === 12 || numero.length === 13)
      ) {
        numero = numero.slice(2);
      }

      return numero;
    }

    function validarNome() {
      const valido = nomeLimpo().split(" ").filter(Boolean).length >= 2;

      nome.setCustomValidity(
        valido ? "" : "Informe o nome completo, com nome e sobrenome."
      );
    }

    function validarTelefone() {
      const valido = /^[1-9]{2}(?:[2-5]\d{7}|9\d{8})$/.test(
        telefoneLimpo()
      );

      telefone.setCustomValidity(
        valido
          ? ""
          : "Informe um telefone com DDD. Ex.: (11) 99999-9999."
      );

      return valido;
    }

    function validarKimono() {
      const valido =
        kimono.disabled ||
        kimono.value === "preciso" ||
        kimono.value === "proprio";

      kimono.setCustomValidity(
        valido
          ? ""
          : "Selecione se precisa de kimono experimental ou vai levar o próprio."
      );
    }

    function formatarTelefone(numero) {
      const restante = numero.slice(2);
      const corte = restante.length === 9 ? 5 : 4;

      return (
        "(" + numero.slice(0, 2) + ") " +
        restante.slice(0, corte) + "-" +
        restante.slice(corte)
      );
    }

    turma.addEventListener("change", atualizarDias);
    dia.addEventListener("change", atualizarHorarios);
    horario.addEventListener("change", atualizarResumo);

    kimono.addEventListener("change", function () {
      validarKimono();
      atualizarResumo();
    });

    nome.addEventListener("input", validarNome);
    telefone.addEventListener("input", validarTelefone);

    telefone.addEventListener("blur", function () {
      if (validarTelefone()) {
        telefone.value = formatarTelefone(telefoneLimpo());
      }
    });

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();

      validarNome();
      validarTelefone();
      validarKimono();

      if (!formulario.reportValidity()) {
        return;
      }

      const selecionada = obterTurma();
      const horarios = selecionada
        ? selecionada.dias[dia.value]
        : null;

      if (
        !Array.isArray(horarios) ||
        !horarios.includes(horario.value) ||
        contato.value !== whatsappEquipe
      ) {
        return;
      }

      if (
        !noGi() &&
        kimono.value !== "preciso" &&
        kimono.value !== "proprio"
      ) {
        return;
      }

      const mensagem = [
        "Olá, equipe Team Thomé!",
        "",
        infantil()
          ? "Sou responsável por uma criança e gostaria de avisar sua participação em uma aula experimental gratuita."
          : "Gostaria de avisar minha participação em uma aula experimental gratuita.",
        "",
        "IDENTIFICAÇÃO PARA A RECEPÇÃO",
        (infantil() ? "Nome da criança: " : "Nome completo: ") +
          nomeLimpo(),
        (infantil()
          ? "Telefone do responsável: "
          : "Telefone de contato: ") +
          formatarTelefone(telefoneLimpo()),
        "",
        "AULA ESCOLHIDA",
        "Turma: " + selecionada.nome,
        "Dia: " + diasDaSemana[dia.value],
        "Horário: " + horario.value,
        ""
      ];

      if (noGi()) {
        mensagem.push(
          "Estou ciente de que a academia não empresta uniforme para No Gi e levarei minha própria roupa de treino.",
          "Podem me orientar sobre a roupa adequada para participar?"
        );
      } else if (kimono.value === "preciso") {
        mensagem.push(
          infantil()
            ? "Kimono: a criança precisa de um kimono experimental."
            : "Kimono: preciso de um kimono experimental."
        );
      } else {
        mensagem.push(
          infantil()
            ? "Kimono: a criança já tem kimono e vai levar o próprio."
            : "Kimono: já tenho kimono e vou levar o meu."
        );
      }

      if (infantil() && dia.value === "sexta") {
        mensagem.push(
          "Gostaria de orientação sobre a primeira participação na aula Kids unificada de rolas."
        );
      }

      mensagem.push(
        "",
        "Vou informar nesta conversa a data da visita.",
        "Podem me passar as orientações para participar?"
      );

      // Prepara a mensagem no WhatsApp.
      // Não envia automaticamente, não salva dados e não reserva aula.
      window.location.assign(
        "https://wa.me/" +
        whatsappEquipe +
        "?text=" +
        encodeURIComponent(mensagem.join("\n"))
      );
    });

    atualizarDias();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();