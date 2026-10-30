import { supabase } from "./supabase-cliente.js";

const formulario = document.querySelector("#formulario-cadastro");
const nomeCompleto = document.querySelector("#nome-completo");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const confirmarSenha = document.querySelector("#confirmar-senha");
const botaoCriarConta = document.querySelector("#botao-criar-conta");
const aviso = document.querySelector("#aviso-cadastro");

const urlConfirmacao =
    "https://kauarubio3005.github.io/team-thome-site/html/login.html";

if (
    !formulario ||
    !nomeCompleto ||
    !email ||
    !senha ||
    !confirmarSenha ||
    !botaoCriarConta ||
    !aviso
) {
    throw new Error(
        "Não foi possível encontrar todos os elementos do formulário de cadastro."
    );
}

let cadastroEmAndamento = false;

function validarNome() {
    const nome = nomeCompleto.value.trim();

    nomeCompleto.setCustomValidity(
        nome.length < 2 || nome.length > 150
            ? "Informe o nome completo do aluno, com 2 a 150 caracteres."
            : ""
    );
}

function validarSenhas() {
    const senhasDiferentes =
        confirmarSenha.value !== "" &&
        senha.value !== confirmarSenha.value;

    confirmarSenha.setCustomValidity(
        senhasDiferentes ? "As senhas precisam ser iguais." : ""
    );
}

nomeCompleto.addEventListener("input", validarNome);
senha.addEventListener("input", validarSenhas);
confirmarSenha.addEventListener("input", validarSenhas);

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (cadastroEmAndamento) {
        return;
    }

    aviso.textContent = "";

    nomeCompleto.value = nomeCompleto.value.trim();
    email.value = email.value.trim();

    validarNome();
    validarSenhas();

    if (!formulario.reportValidity()) {
        return;
    }

    cadastroEmAndamento = true;

    const textoOriginalBotao = botaoCriarConta.textContent;

    botaoCriarConta.disabled = true;
    botaoCriarConta.textContent = "Criando sua conta…";
    formulario.setAttribute("aria-busy", "true");

    aviso.textContent = "Estamos preparando seu cadastro.";

    try {
        const { error } = await supabase.auth.signUp({
            email: email.value,
            password: senha.value,
            options: {
                emailRedirectTo: urlConfirmacao,
                data: {
                    nome_completo: nomeCompleto.value,
                    quer_perfil_aluno: true,
                    quer_acompanhar_menor: false
                }
            }
        });

        if (error) {
            aviso.textContent =
                "Não foi possível concluir o cadastro. Confira os dados e tente novamente. Se o problema continuar, fale com a equipe.";
            return;
        }

        formulario.reset();

        nomeCompleto.setCustomValidity("");
        confirmarSenha.setCustomValidity("");

        aviso.textContent =
            "Solicitação de cadastro enviada. Se houver uma confirmação pendente, confira seu e-mail e a pasta de spam. Após confirmar, acesse o site para entrar. O acesso à área do aluno depende da liberação da equipe.";
    } catch {
        aviso.textContent =
            "Ocorreu um problema ao enviar o cadastro. Verifique sua conexão e tente novamente em alguns instantes.";
    } finally {
        cadastroEmAndamento = false;
        botaoCriarConta.disabled = false;
        botaoCriarConta.textContent = textoOriginalBotao;
        formulario.removeAttribute("aria-busy");
    }
});