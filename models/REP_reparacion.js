const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const REP_estado_rep_itemSchema = new Schema({
        "item":{type:Schema.ObjectId, ref:"REP_item_reparacion"},
        "estado": {
            type:String,
            enum:["PRESUPUESTO","INICIAL","EN PROCESO", "TERMINADO", "NO REPARABLE"],
            default:"INICIAL"
        }
    })

    const REP_insumos_consumidosSchema = new Schema({
        "insumo":{type:Schema.ObjectId, ref:"REP_insumo"},
        "cantidad": {
            type:Number,
            default: 1
        }
    })

    const dispositivoSchema = new Schema({
        "marca" : String,
        "modelo" : String,
        "descrip" : String,
        "codigo" : String,
        "patron": [String],
        "estado": {
            type:String,
            enum:["INICIAL","EN PROCESO", "TERMINADO", "INRREPARABLE"],
            default: "INICIAL"
        },
        "list_item_reparacion":[REP_estado_rep_itemSchema],
        "list_insumos_cons": [REP_insumos_consumidosSchema]
                    
    });

    const reparacionSchema = new Schema({
        "fecha" :{
            type: Date,
            default: Date.now
        },
        "fecha_entrega" :{
            type: Date
        },
        "descrip" : String,
        "empleado" : {
            type:Schema.ObjectId, ref:"ADM_empleado",
            default: undefined 
        },
        "cliente" : {
            type:Schema.ObjectId, ref:"ADM_cliente",
            default: undefined 
        },
        "estado": {
            type:String,
            enum:["INICIAL","EN PROCESO", "TERMINADO", "INRREPARABLE"],
            default:"INICIAL"
        },
        "list_dispositivos": [dispositivoSchema]
        
    });


    module.exports = mongoose.model("REP_reparacion", reparacionSchema,"REP_reparacion");