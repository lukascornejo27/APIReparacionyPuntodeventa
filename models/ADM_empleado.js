const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const empleadoSchema = new Schema({
        "nombre" : String,
        "apellido" : String,
        "cuil" : Number,
        "dni" : Number,
        "direccion": String,
        "telefono": Number,
        "email": String,
        "contrato": [{type:Schema.ObjectId, ref:"ADM_contrato",
                      default: undefined}
                    ],
        "cuenta" : [{type:Schema.ObjectId, ref:"ADM_cuenta_user_emp",
                     default: undefined}
                    ]
                    
    });

    module.exports = mongoose.model("ADM_empleado", empleadoSchema,"ADM_empleado");