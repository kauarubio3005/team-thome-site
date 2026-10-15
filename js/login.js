import { supabase } from "./supabase-cliente.js";

const formulario = document.querySelector(".formulario");
const campoEmail = document.querySelector("#email");
const campoSenha = document.querySelector("#senha");
const botaoEntrar = document.querySelector(".entrar");
const avisoLogin = document.querySelector("#aviso-login");

if (
    !formulario ||
    !campoEmail ||
    !campoSenha ||
    !botaoEntrar ||
    !avisoLogin
) {
    throw new Error("Não foi possível encontrar os elementos do login.");
}

let loginEmAndamento = false;

campoEmail.disabled = false;
campoSenha.disabled = false;
campoEmail.required = true;
campoSenha.required = true;
botaoEntrar.disabled = false;
botaoEntrar.type = "submit";

avisoLogin.setAttribute("role", "status");
avisoLogin.setAttribute("aria-live", "polite");
avisoLogin.textContent =
    "Use o e-mail e a senha da sua conta. O acesso à área restrita ainda está em preparação.";

function atualizarCarregamento(carregando) {
    loginEmAndamento = carregando;

    campoEmail.disabled = carregando;
    campoSenha.disabled = carregando;
    botaoEntrar.disabled = carregando;

    formulario.setAttribute("aria-busy", String(carregando));

    botaoEntrar.textContent = carregando
        ? "Verificando acesso..."
        : "Entrar na minha conta";
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (loginEmAndamento || !formulario.reportValidity()) {
        return;
    }

    const email = campoEmail.value.trim();
    const senha = campoSenha.value;

    atualizarCarregamento(true);
    avisoLogin.textContent = "Verificando seu e-mail e sua senha.";

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: senha
        });

        if (error || !data.session || !data.user) {
            avisoLogin.textContent =
                "Não foi possível entrar. Confira seu e-mail e sua senha e verifique se a conta foi confirmada.";
            return;
        }

        campoSenha.value = "";

        avisoLogin.textContent =
            "Login realizado com sucesso. O acesso à área restrita ainda está em preparação. A solicitação de acompanhamento deverá seguir a orientação da equipe.";
    } catch (erro) {
        console.error("Erro ao realizar login:", erro);

        avisoLogin.textContent =
            "Não foi possível conectar ao serviço de acesso. Verifique sua conexão e tente novamente.";
    } finally {
        atualizarCarregamento(false);
    }
});