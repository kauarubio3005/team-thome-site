import { supabase } from "./supabase-cliente.js";

const formulario = document.querySelector("#formulario-senha");
const senha = document.querySelector("#senha");
const confirmarSenha = document.querySelector("#confirmar-senha");
const botaoSalvar = document.querySelector("#botao-salvar");
const aviso = document.querySelector("#aviso-senha");

if (!formulario || !senha || !confirmarSenha || !botaoSalvar || !aviso) {
    throw new Error(
        "Não foi possível encontrar todos os elementos do formulário de senha."
    );
}

let linkDeRecuperacaoValido = false;
let atualizacaoEmAndamento = false;
let senhaAtualizada = false;

function habilitarFormulario() {
    linkDeRecuperacaoValido = true;
    senha.disabled = false;
    confirmarSenha.disabled = false;
    botaoSalvar.disabled = false;
    aviso.textContent = "Digite e confirme sua nova senha.";
}

function mostrarLinkInvalido() {
    linkDeRecuperacaoValido = false;
    senha.disabled = true;
    confirmarSenha.disabled = true;
    botaoSalvar.disabled = true;
    aviso.textContent =
        "Este link de recuperação expirou ou não é válido. Solicite um novo link pela página de recuperação de senha.";
}

const { data: listenerAuth } = supabase.auth.onAuthStateChange((evento) => {
    if (evento === "PASSWORD_RECOVERY") {
        habilitarFormulario();
    }
});

try {
    // Inicializa a leitura da sessão e dos dados de autenticação
    // que o Supabase devolveu no link de recuperação.
    await supabase.auth.getSession();

    // Dá ao cliente a oportunidade de processar o evento de recuperação
    // antes de mostrar a mensagem de link inválido.
    window.setTimeout(() => {
        if (!linkDeRecuperacaoValido) {
            mostrarLinkInvalido();
        }
    }, 500);
} catch (erro) {
    console.error("Erro ao verificar o link de recuperação:", erro);
    mostrarLinkInvalido();
}

function validarSenhas() {
    const senhasDiferentes =
        confirmarSenha.value !== "" &&
        senha.value !== confirmarSenha.value;

    confirmarSenha.setCustomValidity(
        senhasDiferentes ? "As senhas precisam ser iguais." : ""
    );
}

senha.addEventListener("input", validarSenhas);
confirmarSenha.addEventListener("input", validarSenhas);

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!linkDeRecuperacaoValido || atualizacaoEmAndamento) {
        mostrarLinkInvalido();
        return;
    }

    validarSenhas();

    if (!formulario.reportValidity()) {
        return;
    }

    if (senha.value.length < 8) {
        aviso.textContent = "A senha precisa ter pelo menos 8 caracteres.";
        senha.focus();
        return;
    }

    if (senha.value !== confirmarSenha.value) {
        aviso.textContent = "As senhas não conferem. Verifique os dois campos.";
        confirmarSenha.focus();
        return;
    }

    atualizacaoEmAndamento = true;
    botaoSalvar.disabled = true;
    botaoSalvar.textContent = "Salvando...";
    aviso.textContent = "Estamos atualizando sua senha.";

    try {
        const { error } = await supabase.auth.updateUser({
            password: senha.value
        });

        if (error) {
            console.error("Erro ao atualizar a senha:", error);

            aviso.textContent =
                "Não foi possível atualizar a senha. O link pode ter expirado; solicite outro e tente novamente.";
            atualizacaoEmAndamento = false;
            botaoSalvar.disabled = false;
            botaoSalvar.textContent = "Salvar nova senha";
            return;
        }

        senhaAtualizada = true;
        linkDeRecuperacaoValido = false;
        senha.value = "";
        confirmarSenha.value = "";

        aviso.textContent =
            "Sua senha foi atualizada. Você será encaminhado para a página de login.";

        botaoSalvar.textContent = "Senha atualizada";

        window.setTimeout(() => {
            window.location.href = "login.html";
        }, 2500);
    } catch (erro) {
        console.error("Erro inesperado ao atualizar a senha:", erro);

        aviso.textContent =
            "Ocorreu um problema de conexão. Tente novamente.";
        atualizacaoEmAndamento = false;
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = "Salvar nova senha";
    }
});

window.addEventListener("pagehide", () => {
    listenerAuth.subscription.unsubscribe();
});