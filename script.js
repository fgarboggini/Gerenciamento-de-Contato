const formularioContato = document.getElementById('formulario-contato');
const tabelaContatos = document.querySelector('#tabela-contatos tbody');
const buscarInput = document.getElementById('buscar');
const alternarTemaBtn = document.getElementById('alternar-tema');
let contatos = JSON.parse(localStorage.getItem('contatos')) || [];
let ordemAtual = { coluna: null, ascendente: true };

function salvarContatos() {
    localStorage.setItem('contatos', JSON.stringify(contatos));
}

function adicionarContato(nome, telefone, email) {
    contatos.push({ nome, telefone, email });
    salvarContatos();
    renderizarContatos();
}

function editarContato(indice, nome, telefone, email) {
    contatos[indice] = { nome, telefone, email };
    salvarContatos();
    renderizarContatos();
}

function excluirContato(indice) {
    if (confirm("Você tem certeza que deseja excluir este contato?")) {
        contatos.splice(indice, 1);
        salvarContatos();
        renderizarContatos();
    }
}

function renderizarContatos() {
    tabelaContatos.innerHTML = '';
    contatos.filter(filtrarContatos).forEach((contato, indice) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${contato.nome}</td>
            <td>${contato.telefone}</td>
            <td>${contato.email}</td>
            <td class="acoes">
                <button class="editar" onclick="iniciarEdicao(${indice})">Editar</button>
                <button class="excluir" onclick="excluirContato(${indice})">Excluir</button>
            </td>
        `;
        tabelaContatos.appendChild(tr);
    });
}

function iniciarEdicao(indice) {
    const contato = contatos[indice];
    document.getElementById('nome').value = contato.nome;
    document.getElementById('telefone').value = contato.telefone;
    document.getElementById('email').value = contato.email;
    formularioContato.onsubmit = function (e) {
        e.preventDefault();
        editarContato(indice, document.getElementById('nome').value, document.getElementById('telefone').value, document.getElementById('email').value);
        formularioContato.onsubmit = adicionarNovoContato;
        formularioContato.reset();
    };
}

function adicionarNovoContato(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    adicionarContato(nome, telefone, email);
    formularioContato.reset();
}

function filtrarContatos(contato) {
    const termoBusca = buscarInput.value.toLowerCase();
    return (
        contato.nome.toLowerCase().includes(termoBusca) ||
        contato.telefone.includes(termoBusca) ||
        contato.email.toLowerCase().includes(termoBusca)
    );
}

function ordenarContatos(coluna) {
    if (ordemAtual.coluna === coluna) {
        ordemAtual.ascendente = !ordemAtual.ascendente;
    } else {
        ordemAtual.coluna = coluna;
        ordemAtual.ascendente = true;
    }

    contatos.sort((a, b) => {
        let valorA = a[coluna].toLowerCase();
        let valorB = b[coluna].toLowerCase();

        if (valorA < valorB) return ordemAtual.ascendente ? -1 : 1;
        if (valorA > valorB) return ordemAtual.ascendente ? 1 : -1;
        return 0;
    });

    renderizarContatos();
}

function alternarTema() {
    document.body.classList.toggle('modo-escuro');
    document.querySelectorAll('header, main, th, td, button, input').forEach((el) => {
        el.classList.toggle('modo-escuro');
    });
}

formularioContato.onsubmit = adicionarNovoContato;
buscarInput.addEventListener('input', renderizarContatos);
alternarTemaBtn.addEventListener('click', alternarTema);
renderizarContatos();
