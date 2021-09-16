const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const imageSchema = new Schema({
        "nombre" : String,
        "ubicacion" : String,
        "tipo": String,
        "tamano": String,
        "estado": {
            type: String,
            enum: ["ACTIVO","INACTIVO"],
            default: "ACTIVO"
        }
    });

    module.exports = mongoose.model("GRAL_imagen", imageSchema,"GRAL_imagen");