const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const userSchema = new Schema({
        "nombre" : String,
        "apellido" : String,
        "user" : String,
        "pass" : String,
        "email" : String,
        "celular" : Number,
        "etiqueta" : [String],
        "direcciones" : [String],
        "pedidos" : [String]
    });

    module.exports = mongoose.model("usuario", userSchema,"usuario");