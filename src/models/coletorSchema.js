var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ColetorSchema = new Schema({
  idDispositivo: Number,
  coletorNome: String,
  usuario: String,
  leitura: [
    {
      produtoName: String,
      id: Number,
      preco: String,
      quantidade: Number,
      unidade: String
    }
  ]
});

module.exports = mongoose.model("Coletor", ColetorSchema);
