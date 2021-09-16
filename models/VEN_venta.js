const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;


    const VEN_articuloSchema = new Schema({
        "articulo": {type:Schema.ObjectId, ref:"PRO_articulo"},
        "cantidad": Number,
        "precio": Number
    })  

    const VEN_productSchema = new Schema({
        "producto": {type:Schema.ObjectId, ref:"PRO_producto"},
        "articulos": [VEN_articuloSchema]
    })  

    const ventaSchema = new Schema({
        "fecha" : {
            type: Date,
            default: Date.now()
        },
        "factura" : String,
        "empleado" : {type:Schema.ObjectId, ref:"ADM_empleado"},
        "cliente" : {type:Schema.ObjectId, ref:"ADM_cliente"},
        "list_productos" : [VEN_productSchema]
    });

    module.exports = mongoose.model("VEN_venta", ventaSchema,"VEN_venta");