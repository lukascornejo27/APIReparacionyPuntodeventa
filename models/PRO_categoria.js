const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const categorySchema = new Schema({
        "nombre" : String,
        "descrip" : String,
        "img": {type:Schema.ObjectId, ref:"producto"},
        "estado": {
            type: String,
            enum: ["ACTIVO","INACTIVO"]
        }
    });

    module.exports = mongoose.model("PRO_categoria", categorySchema,"PRO_categoria");