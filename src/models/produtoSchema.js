var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProdutoSchema = new Schema({
  idDispositivo: Number,
  nome: String,
  preco: Number,
  descricao: String
});

module.exports = mongoose.model("Produto", ProdutoSchema);
