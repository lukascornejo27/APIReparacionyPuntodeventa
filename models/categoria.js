const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const categorySchema = new Schema({
        "nombre" : String,
        "descrip" : String,
        "cantProd": String,
        "listProd" : [{type:Schema.ObjectId, ref:"producto"}]
    });

    module.exports = mongoose.model("categoria", categorySchema,"categoria");
