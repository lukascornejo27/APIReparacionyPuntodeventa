const PRO_productModel = require("../models/PRO_producto");
const PRO_categoriaModel = require("../models/PRO_categoria");
const GRAL_imagen = require("../models/GRAL_imagen");

module.exports = {
    getAll: async function(req, res, next) {

        try {
        
            if(req.query.bcat){
                let prodCat = await PRO_productModel.find({categoria:req.query.bcat})
                .populate('categoria')
                .populate('imgs')
                .populate('list_articulos')

                res.status(200).json({docs:prodCat})
            }
            else{
                let productos = await PRO_productModel.find({})
                .populate('categoria')
                .populate('imgs')
                .populate('list_articulos')
                
                res.status(200).json({docs:productos})
            }
        } catch (error) {
            next(error);
        }

        
    },
    getById:async function(req, res, next){
       try {
        if(req.params.id){
            var producto = await PRO_productModel.findOne({}).where({_id:req.params.id})
            .populate('categoria')
            .populate('imgs')

            res.status(200).json({
                estado: true,
                doc: producto
            })
        }
        else {
            res.status(400).json({
                estado:false,
                error: "no se ingreso id en el endpoint"
            })
        }
       } catch (error) {
            res.status(400).json({
                estado:false,
                error: error
            })
           next(error)
       }
    },
    delete: async function(req, res, next){
       try {
        if(req.params.id){
            var producto = await PRO_productModel.deleteOne({_id:req.params.id});
        }
        res.status(200).json(producto)
       } catch (error) {
           next(error)
       }
    },
    save: async function(req, res, next){
                    /* Crear Producto*/
            /*Procesar imagenes*/
            try {
                var files = req.files;
                console.log("files", files);
                if(files){
                    var arrayImages = new Array();
                    for(let i = 0; i < files.length; i++){
                        arrayImages.push({
                            nombre: files[i].originalname,
                            ubicacion: files[i].path,
                            tipo: files[i].mimetype,
                            tamano: files[i].size 
                        })
                    }

                    var imagenes = await GRAL_imagen.insertMany(arrayImages);
                    var imagenesID = new Array();

                    if(imagenes){
                        for(var i = 0; i < imagenes.length; i++){
                            imagenesID.push(imagenes[i]._id)
                        }
                    }

                    console.log("imagenes", imagenesID);

                    const producto = new PRO_productModel({
                        nombre: req.body.name,
                        descrip: req.body.descrip,
                        categoria :req.body.categoria,
                        etiquetas:req.body.etiquetas,
                        date: req.body.date,
                        imgs:imagenesID,
                        list_articulos: [{
                            precio: 100,
                            costo : 50,
                            stock : 10
                            
                        },
                        {
                            precio: 200,
                            costo : 100,
                            stock : 20
                            
                        }] //req.body.list_articulos//
                    })
        
                    console.log(producto);
                    /* Insertar*/
        
                    let prod = await producto.save();
                    
                    res.status(200).json({
                        estado: true,
                        doc: prod
                    })
                }
               
            } catch (error) {
                next(error)
            }
    }
}