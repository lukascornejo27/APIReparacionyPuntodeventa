const mongoose = require("../bin/mongodb");
const Schema = mongoose.Schema;

    const PRO_articulo_varianteSchema = new Schema({
        "titulo": String,
        "valor": String
    })    

    const PRO_articuloSchema = new Schema({
        "precio": Number,
        "costo" : Number,
        "stock" : Number,
        "img": {type:Schema.ObjectId, ref:"GRAL_imagen"},
        "list_variantes":[PRO_articulo_varianteSchema],
        "estado": {
            type:String,
            enum:["ACTIVO","INACTIVO", "AGOTADO"],
            default:"ACTIVO"
        },
        "cuotas":{
            type:Number,
            enum:[1,3,6,9,12,18,24],
            default: 1
        },
        "oferta": {
            type: String,
            enum:["INACTIVO","2x1","3x2","DESCUENTO"],
            default:"INACTIVO"
        }
    })


    const productoSchema = new Schema({
        "nombre":String,
        "descrip" : String,
        "date": {type: Date, default: new Date},
        "imgs" : [{type:Schema.ObjectId, ref:"GRAL_imagen"}],
        "etiquetas" : [String],
        "categoria": [{type:Schema.ObjectId, ref:"PRO_categoria"}],
        "estado": {
            type:String,
            enum:["ACTIVO","INACTIVO"],
            default: "ACTIVO"
        },
        "list_articulos":[PRO_articuloSchema]
    });

    module.exports = mongoose.model("PRO_producto", productoSchema,"PRO_producto");
    //module.exports = mongoose.model("PRO_articulo", PRO_articuloSchema,"PRO_articulo");
    
    