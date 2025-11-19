// ===== DADOS GLOBAIS =====
let usuarioLogado = null;
let carrinho = [];
let conversaChat = [];

// Banco de bebidas
let bebidas = [
    {
        id: 1,
        nome: "Coca Cola - 2L",
        imagem: "imagens/cocacola.png",
        preco: 10.99,
        estoque: 150
    },
    {
        id: 2,
        nome: "Guaraná Antarctica - 2L",
        imagem: "imagens/guarana.png",
        preco: 9.99,
        estoque: 75
    },
    {
        id: 3,
        nome: "Água Crystal - 500ML",
        imagem: "imagens/agua.png",
        preco: 2.59,
        estoque: 300
    },
    {
        id: 4,
        nome: "Cerveja Heineken - 600ML",
        imagem: "imagens/heineken.png",
        preco: 11.99,
        estoque: 120
    },
    {
        id: 5,
        nome: "Cerveja Corona - 330ML",
        imagem: "imagens/corona.png",
        preco: 6.99,
        estoque: 200
    },
    {
        id: 6,
        nome: "Whisky Red Label - 750ML",
        imagem: "imagens/redlabel.png",
        preco: 79.90,
        estoque: 45
    },
    {
        id: 7,
        nome: "Whisky Blue Label - 750ML",
        imagem: "imagens/bluelabel.png",
        preco: 1299.99,
        estoque: 15
    },
    {
        id: 8,
        nome: "Conhaque Dreher - 900ML",
        imagem: "imagens/dreher.png",
        preco: 22.99,
        estoque: 90
    },
    {
        id: 9,
        nome: "Energético Red Bull - 250ML",
        imagem: "imagens/redbull.png",
        preco: 8.99,
        estoque: 150
    }
];

// ===== FUNÇÕES DE AUTENTICAÇÃO =====
function mostrarLogin() {
    document.getElementById("formularioCadastro").classList.add("oculto");
    document.getElementById("formularioLogin").classList.remove("oculto");
}

function mostrarCadastro() {
    document.getElementById("formularioLogin").classList.add("oculto");
    document.getElementById("formularioCadastro").classList.remove("oculto");
}

function obterUsuarios() {
    let usuarios = localStorage.getItem("usuariosBebaJa");
    return usuarios ? JSON.parse(usuarios) : [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem("usuariosBebaJa", JSON.stringify(usuarios));
}

document.getElementById("formularioLogin").addEventListener("submit", function(evento) {
    evento.preventDefault();
    
    let email = document.getElementById("emailLogin").value;
    let senha = document.getElementById("senhaLogin").value;
    
    let usuarios = obterUsuarios();
    let usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuarioEncontrado) {
        usuarioLogado = usuarioEncontrado;
        localStorage.setItem("usuarioLogadoBebaJa", JSON.stringify(usuarioLogado));
        carrinho = [];
        conversaChat = [];
        irParaMenu();
    } else {
        alert("Email ou senha incorretos!");
    }
});

document.getElementById("formularioCadastro").addEventListener("submit", function(evento) {
    evento.preventDefault();
    
    let nome = document.getElementById("nomeCadastro").value;
    let email = document.getElementById("emailCadastro").value;
    let senha = document.getElementById("senhaCadastro").value;
    let confirmarSenha = document.getElementById("confirmarSenha").value;
    
    if (senha !== confirmarSenha) {
        alert("As senhas não conferem!");
        return;
    }
    
    let usuarios = obterUsuarios();
    
    if (usuarios.find(u => u.email === email)) {
        alert("Este email já está cadastrado!");
        return;
    }
    
    let novoUsuario = {
        id: Date.now(),
        nome: nome,
        email: email,
        senha: senha
    };
    
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    
    alert("Cadastro realizado com sucesso! Faça login agora.");
    mostrarLogin();
    document.getElementById("formularioLogin").reset();
});

// ===== FUNÇÕES DE NAVEGAÇÃO =====
function trocarTela(telaNova) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });
    telaNova.classList.add("ativa");
}

function irParaMenu() {
    document.getElementById("nomeUsuario").textContent = usuarioLogado.nome;
    carregarBebidas();
    atualizarCarrinho();
    trocarTela(document.getElementById("telaMenu"));
}

function sair() {
    usuarioLogado = null;
    carrinho = [];
    conversaChat = [];
    localStorage.removeItem("usuarioLogadoBebaJa");
    document.getElementById("formularioLogin").reset();
    document.getElementById("formularioCadastro").reset();
    mostrarLogin();
    trocarTela(document.getElementById("telaAutenticacao"));
}

// ===== FUNÇÕES DO MENU DE BEBIDAS =====
function carregarBebidas() {
    let gridBebidas = document.getElementById("gridBebidas");
    gridBebidas.innerHTML = "";
    
    bebidas.forEach(bebida => {
        let cartao = document.createElement("div");
        cartao.className = "cartaoBebida";
        
        let temEstoque = bebida.estoque > 0;
        let classEstoque = temEstoque ? "" : "indisponivel";
        
        cartao.innerHTML = `
            <div class="imagemBebida">
                <img src="${bebida.imagem}" alt="${bebida.nome}">
            </div>
            <div class="nomeBebida">${bebida.nome}</div>
            <div class="preco">R$ ${bebida.preco.toFixed(2)}</div>
            <div class="estoque ${classEstoque}">
                ${bebida.estoque > 0 ? `Estoque: ${bebida.estoque}` : "Fora de estoque"}
            </div>
            <div class="controlesQuantidade">
                <input type="number" id="quantidade${bebida.id}" value="1" min="1" max="${bebida.estoque}">
            </div>
            <button 
                class="botaoAdicionar" 
                onclick="adicionarAoCarrinho(${bebida.id})"
                ${temEstoque ? "" : "disabled"}
            >
                ${temEstoque ? "Adicionar ao Carrinho" : "Indisponível"}
            </button>
        `;
        
        gridBebidas.appendChild(cartao);
    });
}

function adicionarAoCarrinho(idBebida) {
    let bebida = bebidas.find(b => b.id === idBebida);
    let quantidade = parseInt(document.getElementById("quantidade" + idBebida).value);
    
    if (quantidade <= 0) {
        alert("Digite uma quantidade válida!");
        return;
    }
    
    if (quantidade > bebida.estoque) {
        alert("Quantidade maior que o estoque disponível!");
        return;
    }
    
    let itemExistente = carrinho.find(item => item.id === idBebida);
    
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: bebida.id,
            nome: bebida.nome,
            preco: bebida.preco,
            quantidade: quantidade
        });
    }
    
    atualizarCarrinho();
    document.getElementById("quantidade" + idBebida).value = "1";
    alert("Produto adicionado ao carrinho!");
}

function removerDoCarrinho(idBebida) {
    carrinho = carrinho.filter(item => item.id !== idBebida);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    let listaCarrinho = document.getElementById("listaCarrinho");
    let totalItens = document.getElementById("totalItens");
    let totalCarrinho = document.getElementById("totalCarrinho");
    
    listaCarrinho.innerHTML = "";
    
    let total = 0;
    let quantidadeTotal = 0;
    
    carrinho.forEach(item => {
        let subtotal = item.preco * item.quantidade;
        total += subtotal;
        quantidadeTotal += item.quantidade;
        
        const itemHTML = document.createElement("div");
        itemHTML.className = "itemCarrinho";
        itemHTML.innerHTML = `
            <div class="infoItemCarrinho">
                <div class="nomeItemCarrinho">${item.nome}</div>
                <div class="precoItemCarrinho">${item.quantidade}x R$ ${item.preco.toFixed(2)}</div>
            </div>
            <button class="botaoRemover" onclick="removerDoCarrinho(${item.id})">Remover</button>
        `;
        
        listaCarrinho.appendChild(itemHTML);
    });
    
    totalItens.textContent = quantidadeTotal;
    totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    conversaChat = [];
    document.getElementById("caixaMensagens").innerHTML = "";
    document.getElementById("campoMensagem").value = "";
    
    adicionarMensagemAutomatica("O seu pedido já foi processado e está à caminho.");
    
    trocarTela(document.getElementById("telaChat"));
}

// ===== FUNÇÕES DO CHAT =====
function adicionarMensagemAutomatica(texto) {
    let caixaMensagens = document.getElementById("caixaMensagens");
    
    let mensagem = document.createElement("div");
    mensagem.className = "mensagem mensagemAtendente";
    
    let bolha = document.createElement("div");
    bolha.className = "bolhaMensagem";
    bolha.textContent = texto;
    
    mensagem.appendChild(bolha);
    caixaMensagens.appendChild(mensagem);
    caixaMensagens.scrollTop = caixaMensagens.scrollHeight;
}

function enviarMensagem() {
    let campoMensagem = document.getElementById("campoMensagem");
    let texto = campoMensagem.value.trim();
    
    if (texto === "") {
        return;
    }
    
    // Adicionar mensagem do usuário
    let caixaMensagens = document.getElementById("caixaMensagens");
    
    let mensagemUsuario = document.createElement("div");
    mensagemUsuario.className = "mensagem mensagemUsuario";
    
    let bolhaUsuario = document.createElement("div");
    bolhaUsuario.className = "bolhaMensagem";
    bolhaUsuario.textContent = texto;
    
    mensagemUsuario.appendChild(bolhaUsuario);
    caixaMensagens.appendChild(mensagemUsuario);
    
    conversaChat.push({
        remetente: "usuario",
        texto: texto
    });
    
    campoMensagem.value = "";
    caixaMensagens.scrollTop = caixaMensagens.scrollHeight;
    
    // Simular resposta do atendente
    setTimeout(() => {
        let respostas = [
            "Como podemos te ajudar?",
        ];
        
        let respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
        adicionarMensagemAutomatica(respostaAleatoria);
        
        conversaChat.push({
            remetente: "atendente",
            texto: respostaAleatoria
        });
    }, 1000);
}

function verificarEnter(evento) {
    if (evento.key === "Enter") {
        enviarMensagem();
    }
}

function voltarParaMenu() {
    let confirmar = confirm("Deseja voltar para o menu? Seu carrinho será mantido.");
    if (confirmar) {
        trocarTela(document.getElementById("telaMenu"));
    }
}

// ===== INICIALIZAÇÃO =====
window.addEventListener("load", function() {
    let usuarioSalvo = localStorage.getItem("usuarioLogadoBebaJa");
    if (usuarioSalvo) {
        usuarioLogado = JSON.parse(usuarioSalvo);
        irParaMenu();
    } else {
        trocarTela(document.getElementById("telaAutenticacao"));
    }
});
