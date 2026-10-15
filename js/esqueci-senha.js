import { supabase } from "./supabase-cliente.js";

const formulario = document.querySelector("#formulario-recuperacao");
const email = document.querySelector("#email");
const botaoEnviar = document.querySelector("#botao-enviar");
const aviso = document.querySelector("#aviso-recuperacao");

if (!formulario || !email || !botaoEnviar || !aviso) {
    throw new Error(
        "Não foi possível encontrar todos os elementos do formulário de recuperação."
    );
}

email.disabled = false;
botaoEnviar.disabled = false;
aviso.textContent = "Informe o e-mail associado à sua conta.";

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    email.value = email.value.trim();

    if (!formulario.reportValidity()) {
        return;
    }

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";
    aviso.textContent = "Estamos processando sua solicitação.";

    const urlRedefinicao = new URL(
        "redefinir-senha.html",
        window.location.href
    ).toString();

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(
            email.value,
            {
                redirectTo: urlRedefinicao
            }
        );

        if (error) {
            console.error("Erro ao solicitar recuperação de senha:", error);

            aviso.textContent =
                "Não foi possível enviar a solicitação agora. Confira o e-mail e tente novamente.";
            return;
        }

        aviso.textContent =
            "Se houver uma conta associada a esse e-mail, você receberá as instruções para redefinir a senha. Confira também a caixa de spam.";

        formulario.reset();
    } catch (erro) {
        console.error("Erro inesperado na recuperação de senha:", erro);

        aviso.textContent =
            "Ocorreu um problema de conexão. Tente novamente em alguns instantes.";
    } finally {
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar link de recuperação";
    }
});