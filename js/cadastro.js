import { supabase } from "./supabase-cliente.js";

const formulario = document.querySelector("#formulario-cadastro");
const opcaoAluno = document.querySelector("#perfil-aluno");
const opcaoResponsavel = document.querySelector("#perfil-responsavel");
const nomeCompleto = document.querySelector("#nome-completo");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const confirmarSenha = document.querySelector("#confirmar-senha");
const botaoCriarConta = document.querySelector("#botao-criar-conta");
const aviso = document.querySelector("#aviso-cadastro");

if (
    !formulario ||
    !opcaoAluno ||
    !opcaoResponsavel ||
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

function validarSenhas() {
    const senhasDiferentes =
        confirmarSenha.value !== "" &&
        senha.value !== confirmarSenha.value;

    confirmarSenha.setCustomValidity(
        senhasDiferentes ? "As senhas precisam ser iguais." : ""
    );
}

opcaoAluno.addEventListener("change", () => {
    if (opcaoAluno.checked) {
        opcaoResponsavel.checked = false;
    }
});

opcaoResponsavel.addEventListener("change", () => {
    if (opcaoResponsavel.checked) {
        opcaoAluno.checked = false;
    }
});

senha.addEventListener("input", validarSenhas);
confirmarSenha.addEventListener("input", validarSenhas);

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    aviso.textContent = "";
    validarSenhas();

    if (!opcaoAluno.checked && !opcaoResponsavel.checked) {
        aviso.textContent = "Escolha uma opção para continuar.";
        opcaoAluno.focus();
        return;
    }

    nomeCompleto.value = nomeCompleto.value.trim();
    email.value = email.value.trim();

    if (!formulario.reportValidity()) {
        return;
    }

    botaoCriarConta.disabled = true;
    botaoCriarConta.textContent = "Criando sua conta…";
    aviso.textContent = "Estamos preparando seu cadastro.";

    const urlConfirmacao = new URL(
        "login.html",
        window.location.href
    ).toString();

    try {
        const { error } = await supabase.auth.signUp({
            email: email.value,
            password: senha.value,
            options: {
                emailRedirectTo: urlConfirmacao,
                data: {
                    nome_completo: nomeCompleto.value,
                    quer_perfil_aluno: opcaoAluno.checked,
                    quer_acompanhar_menor: opcaoResponsavel.checked
                }
            }
        });

        if (error) {
            console.error("Erro ao criar conta:", error);

            aviso.textContent =
                "Não foi possível concluir o cadastro. Confira os dados e tente novamente. Se o problema continuar, fale com a equipe.";
            return;
        }

        const querAcompanharMenor = opcaoResponsavel.checked;

        formulario.reset();

        aviso.textContent = querAcompanharMenor
            ? "Cadastro iniciado! Confira seu e-mail e confirme sua conta. A solicitação de acompanhamento será feita conforme orientação da equipe."
            : "Cadastro iniciado! Confira seu e-mail e confirme sua conta. O acesso à área restrita depende da liberação da equipe.";
    } catch (erro) {
        console.error("Erro inesperado no cadastro:", erro);

        aviso.textContent =
            "Ocorreu um problema de conexão. Tente novamente em alguns instantes.";
    } finally {
        botaoCriarConta.disabled = false;
        botaoCriarConta.textContent = "Continuar";
    }
});