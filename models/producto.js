const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const productSingleSchema = new Schema({
        "SKU" : String,
        "nombre" : String,
        "descrip" : String,
        "categoria" : [{type:Schema.ObjectId, ref:"categoria"}],
        "etiquetas" : [String],
        "precio" : Number,
        "costo" : Number,
        "stock" : Number,
        "estado" : Boolean
    });

    module.exports = mongoose.model("producto", productSingleSchema,"producto");


