// =====================================================
// FUTEBOLHUB
// JavaScript principal
// =====================================================


// =====================================================
// IMPORTAÇÕES DO FIREBASE
// =====================================================

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    db
} from "./firebase.js";


// =====================================================
// ELEMENTOS DO HTML
// =====================================================

const campoBusca =
    document.getElementById("campoBusca");

const sugestoesTimes =
    document.getElementById("sugestoesTimes");

const btnPesquisar =
    document.getElementById("btnPesquisar");

const resultadoTimes =
    document.getElementById("resultadoTimes");

const mensagem =
    document.getElementById("mensagem");

const loadingTimes =
    document.getElementById("loadingTimes");

const formAvaliacao =
    document.getElementById("formAvaliacao");

const listaAvaliacoes =
    document.getElementById("listaAvaliacoes");

const mensagemAvaliacao =
    document.getElementById("mensagemAvaliacao");

const listaFavoritos =
    document.getElementById("listaFavoritos");


// =====================================================
// ELEMENTOS DO DASHBOARD
// =====================================================

const totalAvaliacoes =
    document.getElementById("totalAvaliacoes");

const totalFavoritos =
    document.getElementById("totalFavoritos");

const mediaAvaliacoes =
    document.getElementById("mediaAvaliacoes");

const melhorNota =
    document.getElementById("melhorNota");


// =====================================================
// VARIÁVEIS DOS GRÁFICOS
// =====================================================

let graficoNotas = null;

let graficoTimes = null;


// =====================================================
// EVENTOS
// =====================================================

// Botão pesquisar
btnPesquisar.addEventListener(
    "click",
    pesquisarTime
);


// Pesquisa pressionando Enter
campoBusca.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            sugestoesTimes.innerHTML = "";

            pesquisarTime();

        }

        if (event.key === "Escape") {

            sugestoesTimes.innerHTML = "";

        }

    }
);


// Sugestões enquanto digita
campoBusca.addEventListener(
    "input",
    mostrarSugestoes
);


// Formulário de avaliação
formAvaliacao.addEventListener(
    "submit",
    criarAvaliacao
);


// =====================================================
// SUGESTÕES DE TIMES
// =====================================================

let temporizadorSugestoes;


async function mostrarSugestoes() {

    const nome =
        campoBusca.value.trim();


    clearTimeout(
        temporizadorSugestoes
    );


    // Não mostra sugestões com menos de 2 caracteres
    if (nome.length < 2) {

        sugestoesTimes.innerHTML = "";

        return;

    }


    temporizadorSugestoes =
        setTimeout(
            async function () {

                sugestoesTimes.innerHTML = `
                    <div class="carregando-sugestoes">
                        Buscando times...
                    </div>
                `;


                try {

                    const url =
                        `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(nome)}`;


                    const resposta =
                        await fetch(url);


                    if (!resposta.ok) {

                        throw new Error(
                            "Erro ao buscar sugestões."
                        );

                    }


                    const dados =
                        await resposta.json();


                    sugestoesTimes.innerHTML = "";


                    if (
                        !dados.teams ||
                        dados.teams.length === 0
                    ) {

                        sugestoesTimes.innerHTML = `
                            <div class="carregando-sugestoes">
                                Nenhum time encontrado.
                            </div>
                        `;

                        return;

                    }


                    // Limita a 5 sugestões
                    const times =
                        dados.teams.slice(
                            0,
                            5
                        );


                    times.forEach(
                        function (time) {

                            const sugestao =
                                document.createElement(
                                    "div"
                                );


                            sugestao.classList.add(
                                "sugestao-time"
                            );


                            const nomeTime =
                                time.strTeam ||
                                "Time não informado";


                            const pais =
                                time.strCountry ||
                                "País não informado";


                            sugestao.innerHTML = `
                                <div>
                                    <strong>
                                        ${nomeTime}
                                    </strong>

                                    <small>
                                        ${pais}
                                    </small>
                                </div>
                            `;


                            sugestao.addEventListener(
                                "click",
                                function () {

                                    campoBusca.value =
                                        nomeTime;

                                    sugestoesTimes.innerHTML =
                                        "";

                                    pesquisarTime();

                                }
                            );


                            sugestoesTimes.appendChild(
                                sugestao
                            );

                        }
                    );


                } catch (erro) {

                    console.error(
                        "Erro nas sugestões:",
                        erro
                    );

                    sugestoesTimes.innerHTML =
                        "";

                }

            },
            400
        );

}


// =====================================================
// PESQUISAR TIME NA API
// =====================================================

async function pesquisarTime() {

    const nomeTime =
        campoBusca.value.trim();


    // Verifica se foi digitado algo
    if (!nomeTime) {

        mensagem.textContent =
            "Digite o nome de um time.";

        resultadoTimes.innerHTML =
            "";

        return;

    }


    // Mostra carregamento
    loadingTimes.classList.remove(
        "hidden"
    );


    mensagem.textContent =
        "";

    resultadoTimes.innerHTML =
        "";


    try {

        // URL da API
        const url =
            `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(nomeTime)}`;


        // Requisição
        const resposta =
            await fetch(url);


        // Verifica erro HTTP
        if (!resposta.ok) {

            throw new Error(
                "Erro na resposta da API."
            );

        }


        // Converte resposta para JSON
        const dados =
            await resposta.json();


        // Verifica resultados
        if (
            !dados.teams ||
            dados.teams.length === 0
        ) {

            mensagem.textContent =
                "Nenhum time encontrado.";

            return;

        }


        // Mostra quantidade encontrada
        mensagem.textContent =
            `${dados.teams.length} time(s) encontrado(s).`;


        // Mostra os cards
        mostrarTimes(
            dados.teams
        );


        // Rola para a seção de times
        document
            .getElementById("times")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (erro) {

        console.error(
            "Erro na pesquisa:",
            erro
        );


        mensagem.textContent =
            "Não foi possível consultar a API. Tente novamente.";


    } finally {

        // Esconde carregamento
        loadingTimes.classList.add(
            "hidden"
        );

    }

}


// =====================================================
// MOSTRAR TIMES
// =====================================================

function mostrarTimes(times) {

    resultadoTimes.innerHTML =
        "";


    times.forEach(
        function (time) {

            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "card-time"
            );


            const escudo =
                time.strBadge ||
                "https://via.placeholder.com/120";


            const nome =
                time.strTeam ||
                "Nome não informado";


            const pais =
                time.strCountry ||
                "Não informado";


            const liga =
                time.strLeague ||
                "Não informado";


            card.innerHTML = `

                <img
                    src="${escudo}"
                    alt="Escudo do ${nome}"
                    onerror="
                        this.src =
                        'https://via.placeholder.com/120';
                    "
                >

                <h3>
                    ${nome}
                </h3>

                <p>
                    <strong>País:</strong>
                    ${pais}
                </p>

                <p>
                    <strong>Liga:</strong>
                    ${liga}
                </p>

                <button
                    class="btn-favoritar"
                >
                    Favoritar
                </button>

            `;


            // Botão de favorito
            const botao =
                card.querySelector(
                    ".btn-favoritar"
                );


            botao.addEventListener(
                "click",
                function () {

                    favoritarTime(
                        time
                    );

                }
            );


            resultadoTimes.appendChild(
                card
            );

        }
    );

}


// =====================================================
// FAVORITAR TIME
// =====================================================

async function favoritarTime(time) {

    try {

        mensagem.textContent =
            "Salvando favorito...";


        await addDoc(
            collection(
                db,
                "favoritos"
            ),
            {

                idTime:
                    time.idTeam,

                nomeTime:
                    time.strTeam,

                pais:
                    time.strCountry ||
                    "Não informado",

                liga:
                    time.strLeague ||
                    "Não informado",

                escudo:
                    time.strBadge ||
                    "",

                data:
                    new Date()
                        .toISOString()

            }
        );


        mensagem.textContent =
            `${time.strTeam} foi adicionado aos favoritos!`;


        // Atualiza favoritos
        await listarFavoritos();


        // Atualiza dashboard
        await atualizarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao favoritar:",
            erro
        );


        mensagem.textContent =
            "Erro ao salvar o favorito.";

    }

}


// =====================================================
// LISTAR FAVORITOS
// =====================================================

async function listarFavoritos() {

    listaFavoritos.innerHTML =
        `
        <div class="loading">
            <div class="spinner"></div>
            <p>Carregando favoritos...</p>
        </div>
        `;


    try {

        const consulta =
            await getDocs(
                collection(
                    db,
                    "favoritos"
                )
            );


        listaFavoritos.innerHTML =
            "";


        // Nenhum favorito
        if (consulta.empty) {

            listaFavoritos.innerHTML =
                `
                <p>
                    Nenhum favorito cadastrado.
                </p>
                `;

            return;

        }


        // Percorre favoritos
        consulta.forEach(
            function (documento) {

                const favorito =
                    documento.data();


                const id =
                    documento.id;


                const card =
                    document.createElement(
                        "div"
                    );


                card.classList.add(
                    "card-favorito"
                );


                card.innerHTML = `

                    <img
                        src="${favorito.escudo}"
                        alt="Escudo do ${favorito.nomeTime}"
                        onerror="
                            this.src =
                            'https://via.placeholder.com/90';
                        "
                    >

                    <h3>
                        ${favorito.nomeTime}
                    </h3>

                    <p>
                        ${favorito.pais}
                    </p>

                    <button
                        class="btn-remover"
                    >
                        Remover
                    </button>

                `;


                const botaoRemover =
                    card.querySelector(
                        ".btn-remover"
                    );


                botaoRemover.addEventListener(
                    "click",
                    function () {

                        removerFavorito(
                            id
                        );

                    }
                );


                listaFavoritos.appendChild(
                    card
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar favoritos:",
            erro
        );


        listaFavoritos.innerHTML =
            `
            <p>
                Erro ao carregar favoritos.
            </p>
            `;

    }

}


// =====================================================
// REMOVER FAVORITO
// =====================================================

async function removerFavorito(id) {

    const confirmar =
        confirm(
            "Deseja remover este time dos favoritos?"
        );


    if (!confirmar) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "favoritos",
                id
            )
        );


        mensagem.textContent =
            "Favorito removido com sucesso!";


        await listarFavoritos();


        // Atualiza dashboard
        await atualizarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao remover favorito:",
            erro
        );


        mensagem.textContent =
            "Não foi possível remover o favorito.";

    }

}


// =====================================================
// CREATE
// CRIAR AVALIAÇÃO
// =====================================================

async function criarAvaliacao(event) {

    event.preventDefault();


    // Obtém os valores do formulário
    const nome =
        document
            .getElementById("nomeUsuario")
            .value
            .trim();


    const time =
        document
            .getElementById("nomeTime")
            .value
            .trim();


    const comentario =
        document
            .getElementById("comentario")
            .value
            .trim();


    const nota =
        Number(
            document
                .getElementById("nota")
                .value
        );


    // Validação
    if (
        !nome ||
        !time ||
        !comentario
    ) {

        mensagemAvaliacao.textContent =
            "Preencha todos os campos.";

        return;

    }


    try {

        mensagemAvaliacao.textContent =
            "Salvando avaliação...";


        // Cria documento no Firestore
        await addDoc(
            collection(
                db,
                "avaliacoes"
            ),
            {

                nome:
                    nome,

                time:
                    time,

                comentario:
                    comentario,

                nota:
                    nota,

                data:
                    new Date()
                        .toISOString()

            }
        );


        mensagemAvaliacao.textContent =
            "Avaliação cadastrada com sucesso!";


        // Limpa formulário
        formAvaliacao.reset();


        // Atualiza avaliações
        await listarAvaliacoes();


        // Atualiza dashboard
        await atualizarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao criar avaliação:",
            erro
        );


        mensagemAvaliacao.textContent =
            "Erro ao salvar avaliação.";

    }

}


// =====================================================
// READ
// LISTAR AVALIAÇÕES
// =====================================================

async function listarAvaliacoes() {

    listaAvaliacoes.innerHTML =
        `
        <div class="loading">

            <div class="spinner"></div>

            <p>
                Carregando avaliações...
            </p>

        </div>
        `;


    try {

        const consulta =
            await getDocs(
                collection(
                    db,
                    "avaliacoes"
                )
            );


        listaAvaliacoes.innerHTML =
            "";


        // Nenhuma avaliação
        if (consulta.empty) {

            listaAvaliacoes.innerHTML =
                `
                <div class="avaliacao">

                    <p>
                        Ainda não existem avaliações.
                    </p>

                </div>
                `;

            return;

        }


        // Percorre avaliações
        consulta.forEach(
            function (documento) {

                const avaliacao =
                    documento.data();


                const id =
                    documento.id;


                const nota =
                    Number(
                        avaliacao.nota
                    );


                const estrelas =
                    "★".repeat(nota);


                const div =
                    document.createElement(
                        "div"
                    );


                div.classList.add(
                    "avaliacao"
                );


                div.innerHTML = `

                    <div
                        class="avaliacao-cabecalho"
                    >

                        <div>

                            <h3>
                                ${avaliacao.time}
                            </h3>

                            <p class="autor">

                                Avaliado por
                                ${avaliacao.nome}

                            </p>

                        </div>

                        <div class="nota">

                            ${estrelas}

                        </div>

                    </div>


                    <p class="comentario">

                        ${avaliacao.comentario}

                    </p>


                    <div class="acoes">

                        <button
                            class="btn-editar"
                        >
                            Editar
                        </button>

                        <button
                            class="btn-excluir"
                        >
                            Excluir
                        </button>

                    </div>

                `;


                // Botão editar
                const btnEditar =
                    div.querySelector(
                        ".btn-editar"
                    );


                btnEditar.addEventListener(
                    "click",
                    function () {

                        editarAvaliacao(
                            id,
                            avaliacao
                        );

                    }
                );


                // Botão excluir
                const btnExcluir =
                    div.querySelector(
                        ".btn-excluir"
                    );


                btnExcluir.addEventListener(
                    "click",
                    function () {

                        excluirAvaliacao(
                            id
                        );

                    }
                );


                listaAvaliacoes.appendChild(
                    div
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao listar avaliações:",
            erro
        );


        listaAvaliacoes.innerHTML =
            `
            <div class="avaliacao">

                <p>
                    Não foi possível carregar
                    as avaliações.
                </p>

            </div>
            `;

    }

}


// =====================================================
// UPDATE
// EDITAR AVALIAÇÃO
// =====================================================

async function editarAvaliacao(
    id,
    avaliacaoAtual
) {

    const novoComentario =
        prompt(
            "Digite o novo comentário:",
            avaliacaoAtual.comentario
        );


    // Usuário cancelou
    if (
        novoComentario === null
    ) {

        return;

    }


    const comentario =
        novoComentario.trim();


    // Verifica comentário
    if (!comentario) {

        alert(
            "O comentário não pode ficar vazio."
        );

        return;

    }


    try {

        const referencia =
            doc(
                db,
                "avaliacoes",
                id
            );


        // Atualiza Firestore
        await updateDoc(
            referencia,
            {

                comentario:
                    comentario

            }
        );


        mensagemAvaliacao.textContent =
            "Avaliação atualizada com sucesso!";


        // Atualiza lista
        await listarAvaliacoes();


        // Atualiza dashboard
        await atualizarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao atualizar:",
            erro
        );


        mensagemAvaliacao.textContent =
            "Erro ao atualizar avaliação.";

    }

}


// =====================================================
// DELETE
// EXCLUIR AVALIAÇÃO
// =====================================================

async function excluirAvaliacao(
    id
) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta avaliação?"
        );


    if (!confirmar) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "avaliacoes",
                id
            )
        );


        mensagemAvaliacao.textContent =
            "Avaliação excluída com sucesso!";


        // Atualiza lista
        await listarAvaliacoes();


        // Atualiza dashboard
        await atualizarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao excluir:",
            erro
        );


        mensagemAvaliacao.textContent =
            "Erro ao excluir avaliação.";

    }

}


// =====================================================
// DASHBOARD
// ATUALIZAR DADOS
// =====================================================

async function atualizarDashboard() {

    try {

        // =============================================
        // BUSCAR AVALIAÇÕES
        // =============================================

        const consultaAvaliacoes =
            await getDocs(
                collection(
                    db,
                    "avaliacoes"
                )
            );


        const avaliacoes = [];


        consultaAvaliacoes.forEach(
            function (documento) {

                avaliacoes.push(
                    documento.data()
                );

            }
        );


        // =============================================
        // TOTAL DE AVALIAÇÕES
        // =============================================

        totalAvaliacoes.textContent =
            avaliacoes.length;


        // =============================================
        // MÉDIA DAS NOTAS
        // =============================================

        let somaNotas = 0;


        avaliacoes.forEach(
            function (avaliacao) {

                somaNotas +=
                    Number(
                        avaliacao.nota
                    );

            }
        );


        const media =
            avaliacoes.length > 0
                ? somaNotas / avaliacoes.length
                : 0;


        mediaAvaliacoes.textContent =
            media.toFixed(1);


        // =============================================
        // MELHOR NOTA
        // =============================================

        let maiorNota = 0;


        avaliacoes.forEach(
            function (avaliacao) {

                const nota =
                    Number(
                        avaliacao.nota
                    );


                if (
                    nota > maiorNota
                ) {

                    maiorNota =
                        nota;

                }

            }
        );


        melhorNota.textContent =
            maiorNota;


        // =============================================
        // DISTRIBUIÇÃO DAS NOTAS
        // =============================================

        const distribuicao = [
            0,
            0,
            0,
            0,
            0
        ];


        avaliacoes.forEach(
            function (avaliacao) {

                const nota =
                    Number(
                        avaliacao.nota
                    );


                if (
                    nota >= 1 &&
                    nota <= 5
                ) {

                    distribuicao[
                        nota - 1
                    ]++;

                }

            }
        );


        criarGraficoNotas(
            distribuicao
        );


        // =============================================
        // TIMES MAIS AVALIADOS
        // =============================================

        const times = {};


        avaliacoes.forEach(
            function (avaliacao) {

                const nome =
                    avaliacao.time;


                if (!times[nome]) {

                    times[nome] =
                        0;

                }


                times[nome]++;

            }
        );


        // Ordena do maior para o menor
        const ranking =
            Object.entries(times)
                .sort(
                    function (a, b) {

                        return (
                            b[1] - a[1]
                        );

                    }
                )
                .slice(0, 5);


        criarGraficoTimes(
            ranking
        );


        // =============================================
        // BUSCAR FAVORITOS
        // =============================================

        const consultaFavoritos =
            await getDocs(
                collection(
                    db,
                    "favoritos"
                )
            );


        totalFavoritos.textContent =
            consultaFavoritos.size;


    } catch (erro) {

        console.error(
            "Erro ao atualizar dashboard:",
            erro
        );

    }

}


// =====================================================
// GRÁFICO DE NOTAS
// =====================================================

function criarGraficoNotas(
    distribuicao
) {

    const elemento =
        document.getElementById(
            "graficoNotas"
        );


    if (!elemento) {

        return;

    }


    // Destrói gráfico anterior
    if (graficoNotas) {

        graficoNotas.destroy();

    }


    graficoNotas =
        new Chart(
            elemento,
            {

                type:
                    "doughnut",

                data: {

                    labels: [

                        "1 estrela",

                        "2 estrelas",

                        "3 estrelas",

                        "4 estrelas",

                        "5 estrelas"

                    ],

                    datasets: [

                        {

                            data:
                                distribuicao,

                            backgroundColor: [

                                "#d8dfdb",

                                "#b9c9c1",

                                "#8ea99b",

                                "#527765",

                                "#b99a5c"

                            ],

                            borderWidth:
                                0,

                            hoverOffset:
                                6

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "72%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                padding:
                                    18,

                                usePointStyle:
                                    true,

                                font: {

                                    size:
                                        11

                                }

                            }

                        }

                    }

                }

            }
        );

}


// =====================================================
// GRÁFICO DOS TIMES MAIS AVALIADOS
// =====================================================

function criarGraficoTimes(
    ranking
) {

    const elemento =
        document.getElementById(
            "graficoTimes"
        );


    if (!elemento) {

        return;

    }


    // Destrói gráfico anterior
    if (graficoTimes) {

        graficoTimes.destroy();

    }


    graficoTimes =
        new Chart(
            elemento,
            {

                type:
                    "bar",

                data: {

                    labels:
                        ranking.map(
                            function (item) {

                                return item[0];

                            }
                        ),

                    datasets: [

                        {

                            label:
                                "Avaliações",

                            data:
                                ranking.map(
                                    function (item) {

                                        return item[1];

                                    }
                                ),

                            backgroundColor:
                                "#164a3a",

                            borderRadius:
                                6,

                            borderSkipped:
                                false

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                stepSize:
                                    1

                            },

                            grid: {

                                color:
                                    "#edf0ec"

                            }

                        },

                        x: {

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}


// =====================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =====================================================

async function iniciarAplicacao() {

    try {

        // Carrega avaliações
        await listarAvaliacoes();


        // Carrega favoritos
        await listarFavoritos();


        // Carrega dashboard
        await atualizarDashboard();


    } catch (erro) {

        console.error(
            "Erro ao iniciar aplicação:",
            erro
        );

    }

}


// =====================================================
// INICIAR
// =====================================================

iniciarAplicacao();