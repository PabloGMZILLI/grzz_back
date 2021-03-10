# Descrição do Projeto
Projeto desenvolvido na disciplina fábrica de software, cursado na faculdade IMED.

## Tecnologias Utilizadas
As técnologias utilizadas são: NodeJS, NPM e MongoDB.

## Bibliotecas utilizadas
	* body-parser versão 1.19.0,
	* express versão 4.17.1,
	* express-validator versão 6.2.0,
	* mongoose versão 5.6.11,
	* request versão 2.88.0,
	* nodemon versão 1.19.1

# Como Instalar
Utilizando o terminal navegue até a pasta que deseja salvar o projeto;
Clone o repositório com o comando ```git clone <link>```;
Após o projeto ser clonado com sucesso utilize o comando ```npm install``` para instalar as dependências;
Para iniciar o projeto utilize o comando ```npm start```.

# Como Utilizar
Para fazer os testes a seguir você deverá executar o seguinte processo:

Entre na pasta do projeto via terminal;
Rodar a aplicação com o comando ```npm start```.

Após isso utilize uma das aplicações "Postman" ou "Insomnia" para realizar as consultas.
# Rotas de acesso a API:

### Cadastrar Coletor
POST http://localhost:3333/api/coletores/cadastrarColetor

Header: idDispositivo: Number
{
"coletorNome": String,
  "usuario": String,
  "leitura": [
    {
      "produtoName": String,
      "id": Number,
      "preco": String,
      "quantidade": Number,
      "unidade": String
    }
  ]
}

### Selecionar Todos os Coletores
GET http://localhost:3333/api/coletores/listarColetores

### Selecionar coletor por Id
GET http://localhost:3333/api/coletores/buscarColetor/:coletor_id

### Excluir coletor por Id
Delete http://localhost:3333/api/coletores/deletarColetor/:coletor_id

### Atualizar coletor por Id
PUT http://localhost:3333/api/coletores/alterarColetor/:coletor_id

Header: idDispositivo: Number

==========================================================================================


### Cadastrar Produto
POST http://localhost:3333/api/produtos/cadastrarProduto

Header: idDispositivo: Number
{
 "nome": String,
  "preco": Number,
  "descricao": String
}
### Selecionar Todos os Produtos
GET http://localhost:3333/api/produtos/listarProdutos

### Selecionar produto por Id
GET http://localhost:3333/api/produtos/buscarProduto/:produto_id

### Excluir produto por Id
Delete http://localhost:3333/api/produtos/deletarProduto/:produto_id

### Atualizar produto por Id
PUT http://localhost:3333/api/produtos/alterarProduto/:produto_id

Header: idDispositivo: Number

## Desenvolvedor

[Pablo Germano Maronezi Zilli](https://www.linkedin.com/in/pablo-maronezi/)
