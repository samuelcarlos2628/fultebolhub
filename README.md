# ⚽ FutebolHub

## Descrição

O FutebolHub é uma aplicação web desenvolvida como projeto acadêmico.

A aplicação permite consultar informações sobre times de futebol
por meio de uma API externa, adicionar times aos favoritos e
cadastrar avaliações dos usuários.

As avaliações e os favoritos são armazenados em um banco de
dados online utilizando o Firebase Cloud Firestore.

---

# Funcionalidades

- Pesquisa de times de futebol;
- Consulta de dados através de API externa;
- Exibição do escudo do time;
- Exibição do país do time;
- Exibição da liga;
- Sistema de favoritos;
- Cadastro de avaliações;
- Listagem de avaliações;
- Edição de avaliações;
- Exclusão de avaliações;
- Interface responsiva;
- Tratamento de erros;
- Indicador de carregamento.

---

# Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Firebase Cloud Firestore
- TheSportsDB API
- GitHub
- GitHub Pages

---

# API utilizada

A aplicação utiliza a API TheSportsDB.

A API é utilizada para pesquisar informações sobre times
de futebol.

Site oficial:

https://www.thesportsdb.com/

---

# Banco de dados

O banco de dados utilizado é o Firebase Cloud Firestore.

São utilizadas duas coleções:

## avaliacoes

Armazena:

- nome do usuário;
- nome do time;
- comentário;
- nota;
- data.

## favoritos

Armazena:

- ID do time;
- nome do time;
- país;
- liga;
- escudo;
- data.

---

# Operações CRUD

A aplicação implementa as quatro operações básicas de CRUD.

## CREATE

O usuário pode criar uma nova avaliação.

## READ

A aplicação consulta e lista as avaliações cadastradas
no Firestore.

## UPDATE

O usuário pode editar o comentário de uma avaliação.

## DELETE

O usuário pode excluir uma avaliação.

---

# GitHub Pages

Aplicação publicada:

https://github.com/samuelcarlos2628/fultebolhub.git

---

# Como utilizar

## 1. Pesquisar um time

Digite o nome de um time no campo de pesquisa.

Exemplo:

Flamengo

Depois clique em:

Pesquisar

---

## 2. Favoritar um time

Depois de pesquisar um time, clique em:

❤️ Favoritar

O time será armazenado no Firebase Firestore.

---

## 3. Criar avaliação

Preencha:

Nome

Time

Nota

Comentário

Depois clique:

Salvar avaliação

---

## 4. Editar avaliação

Na avaliação desejada clique:

Editar

Digite o novo comentário.

---

## 5. Excluir avaliação

Clique:

Excluir

Confirme a exclusão.

---

# Integrantes

- Samuel  Araújo
- João Moraes

---

# Capturas de tela

## Tela inicial

![Tela inicial](imagens/tela-inicial.png)

## Pesquisa de time

![Pesquisa de time](imagens/busca-time.png)

## Avaliações

![Avaliações](imagens/avaliacoes.png)

---

# Estrutura do projeto

futebolhub/

├── index.html

├── style.css

├── script.js

├── firebase.js

└── README.md

---

# Hospedagem

O projeto está hospedado utilizando GitHub Pages.

O código-fonte está disponível em um repositório público
do GitHub.

---

# Autor

Projeto acadêmico desenvolvido para fins educacionais.