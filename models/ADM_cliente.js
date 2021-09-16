const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const clienteSingleSchema = new Schema({
        "nombre" : String,
        "apellido" : String,
        "dni": Number,
        "telefono" : Number,
        "email" : String,
        "cuenta" : [{type:Schema.ObjectId, ref:"ADM_cli_usuario",
                     default: undefined}
                    ],
        "estado" : Boolean,
        "categoria": String
    });

    module.exports = mongoose.model("ADM_cliente", clienteSingleSchema,"ADM_cliente");