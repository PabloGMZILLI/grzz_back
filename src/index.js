// Imports das bibliotecas usadas
const express = require("express");
var bodyParser = require("body-parser");

const routes = require('./routes/routes')

// Aplicação está rodando na porta 3333
var port = process.env.port || 3333;

const app = express();


// usando bibliotecas
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

// rota teste pra ver se a api está funcionando
app.get("/", (req, res) => {
  res.json({ message: "Tudo 100%!" });
});


// Biblioteca do Express vai rodar na porta tal... e vai printar no console(terminal)
app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});

// caso uma página não seja encontrada vai retornar um erro
app.use((req, res) => {
  res.status(404).json({ response: "Pagina não encontrada!" });
});
