const { Number } = require("../bin/mongodb");
const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const insumoSchema = new Schema({
        "nombre" : String,
        "cantidad": {
            type: Number,
            min: 0
        },
        "minimo": Number,
        "costo": Number,
        "estado": {type: Boolean, default: true},
                    
    });

    module.exports = mongoose.model("REP_insumo", insumoSchema,"REP_insumo");