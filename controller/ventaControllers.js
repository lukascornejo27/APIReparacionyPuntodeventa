const VEN_ventaModel = require("../models/VEN_venta");
const PRO_productoModel = require("../models/PRO_producto");

module.exports = {
    getAll: async function(req, res, next) {

        try {
        
            if(req.query.bcat){
                let prodCat = await VEN_ventaModel.find({categoria:req.query.bcat})
                .populate('categoria')
                .populate('imgs')

                res.status(200).json({docs:prodCat})
            }
            else{
                let productos = await VEN_ventaModel.find({})
                .populate('categoria')
                .populate('imgs')
                
                res.status(200).json({docs:productos})
            }
        } catch (error) {
            next(error);
        }

        
    },
    getById:async function(req, res, next){
       try {
        if(req.params.id){
            var producto = await VEN_ventaModel.findOne({}).where({_id:req.params.id})
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
            var producto = await VEN_ventaModel.deleteOne({_id:req.params.id});
        }
        res.status(200).json(producto)
       } catch (error) {
           next(error)
       }
    },
    update: async function (req, res, next){

    }
    ,
    save: async function(req, res, next){
                    /* Crear Venta*/
            try {

                /* Validar venta*/

                var list_productos = req.body.list_productos;
                var doc = [];

                if(list_productos){
                    
                    for(let i = 0; i < list_productos.length; i++){
                        doc.push(await validaArticulo(list_productos[i]))
                    }
                    console.log("doc.estado",doc[0].estado)

                    if(doc[0].estado == "FALSE" || doc[0].estado == "VACIO" || doc == []){
                        res.status(200).json({  
                            estado:false,
                            error: "no hay sufieciente stock para algun articulo",
                            doc:doc,
                        })
                    }
                    else {
                        const venta = new VEN_ventaModel({
                            fecha: req.body.fecha,
                            empleado: req.body.empleado,
                            cliente: req.body.cliente,
                            list_productos: req.body.list_productos
                        })
            
                        
                        /* Insertar*/
            
                        let consulta = await venta.save();
                        console.log(consulta);
                        
                        var articulos = consulta.list_productos;
                        console.log(articulos);

                        for(let i = 0; i < list_productos.length; i++){
                            upadateArticulo(list_productos[i])
                        }
                        /*Generar Factura*/

                        var factura = await VEN_ventaModel.aggregate([
                            { $match : { "_id": venta._id } 
                           },
                           { $unwind: "$list_productos" },
                           {$group: {
                                    _id: { venta: "$_id", fecha: "$fecha",producto:"$list_productos.producto", articulos: "$list_productos.articulos" },
                                   }
                            },
                            { $unwind: "$_id.articulos" },
                            {$group: {
                                    _id: { venta: "$_id.venta", fecha: "$_id.fecha",producto:"$_id.producto", articulo: "$_id.articulos.articulo", cantidad: "$_id.articulos.cantidad", precio:"$_id.articulos.precio" },
                                    subtotal: { $sum: { $multiply: [ "$_id.articulos.precio", "$_id.articulos.cantidad"] } }
                                    }
                                  
                            },
                             
                              {$group: {
                                    _id: { venta: "$_id.venta", fecha: "$_id.fecha"},
                                         productos:{
                                                $push:
                                                        {producto: "$_id.producto", 
                                                        articulo: "$_id.articulo", 
                                                        cantidad: "$_id.cantidad", 
                                                        precio: "$_id.precio",
                                                        subtotal: "$subtotal"
                                                       }
                                                    
                                             }  , 
                                         total: { $sum: "$subtotal" }
                                   },
                                  
                              },
                              
                            {
                                $sort:{
                                        "productos": 1
                                    }
                            }
                          
                        ])
                        console.log("factura",factura);

                        res.status(200).json({
                            estado: true,
                            doc: consulta,
                            factura: factura
                        })
                    }

                }        
            
        } catch (error) {
            next(error)
        }

        async function validaArticulo(productoVEN){
            var informe= {
                producto: productoVEN,
                estado : "TRUE",
                docs : []
            }
            var productoBD = await PRO_productoModel.findById(productoVEN.producto);
            console.log("proBD",productoBD);
            var articulosVEN = productoVEN.articulos;
            console.log("artVEN",articulosVEN);
           
            var articulosBD = productoBD.list_articulos;

            console.log("artiBD",articulosBD);

            for(var i=0; i<articulosVEN.length;i++){
                let artBD = articulosBD.find(obj => obj._id == articulosVEN[i].articulo);
                console.log("artBD",artBD);
                let cantidad = artBD.stock
                console.log("cantArtBD",cantidad);
                if(articulosVEN[i].cantidad > cantidad){
                    informe.estado = "FALSE";
                    informe.docs.push({
                        estado: "FALSE",
                        error: "cantidad insuficiente",
                        articulo: articulosVEN[i],
                        cantRequerida: articulosVEN[i].cantidad 
                    });
                }
                else {
                    informe.docs.push({
                        estado: "TRUE",
                        articulo: articulosVEN[i],
                        cantRequerida: articulosVEN[i].cantidad 
                    });
                }
            }
            if(informe.docs.length == 0){
                informe.estado = "VACIO"
            }
            console.log("informe",informe)
            return informe;
            
        }

        async function upadateArticulo (producto){
            var articulos = producto.articulos;
            console.log("articulos", articulos);
            console.log("productoId", producto.producto)
            console.log("cant Art",articulos[0].cantidad);
            if(articulos){
                try {
                
                    articulos.forEach( async function(elem){
                        console.log("elem", elem);

                        var update = {
                            "$inc": {
                                "list_articulos.$[element].stock": -elem.cantidad
                            }
                        }
    
                        var update_arrayFilter = {
                            arrayFilters: [ { "element._id": { _id: elem.articulo } } ]
                        }
    
                        var consulta = await PRO_productoModel.updateOne(
                        {_id: producto.producto},
                        update, 
                        update_arrayFilter
                        )

                        console.log("consulta",consulta);
                    })
                } catch (error) {
                    next(error)
                }
            }
            
        }
    }
}