const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const itemRepSchema = new Schema({
        "nombre": String,
        "dificultad": String,
        "precio": Number,
        "list_insumos" : [{
            "id_insumo" : {type:Schema.ObjectId, ref:"REP_insumo"},
            "cantidad": {
                type: Number,
                default: 0
            }
        }
    ]
                    
    });

    module.exports = mongoose.model("REP_item_reparacion", itemRepSchema,"REP_item_reparacion");