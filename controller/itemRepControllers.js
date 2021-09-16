const itemReparacionModel = require("../models/REP_item_reparacion");

module.exports = {
    getAll: async function(req,res, next) {

        try {

            var item = await itemReparacionModel.find({})
            .sort({nombre:1})

            if(!item){
                res.status(400).json({
                    estado: false,
                    error:error
                })
            }
            else {
                res.status(200).json({
                    estado:true,
                    docs: item
                })
            }


        } catch (error) {
            next(error);
        }

        
    },
    getById: async function(req, res, next){
               try {
                   if(req.params.id){
                        await itemReparacionModel.find({_id:req.params.id},async function(error, doc){
                            if(error){
                                res.status(400).json({
                                    estado: false,
                                    error:error
                                })
                            }
                            else {
                                res.status(200).json({
                                    estado:true,
                                    docs: doc
                                })
                            }
                        })
                   }
                    
               } catch (error) {
                   next(error)
               }
    },
    update : async function(req,res, next){
        try {
            if(req.params.id){
                const update = {
                    "nombre": req.body.nombre,
                    "dificultad": req.body.dificultad,
                    "precio": req.body.precio,
                    "list_insumos" : req.body.list_insumos
                }
                await itemReparacionModel.findOneAndUpdate({
                    _id: req.params.id,
                },
                update,
                {new: true}
                ,
                (err, doc) => {
                    if (err) {
                        res.status(400).json({
                            estado: false,
                            error:err
                        })
                    } else {
                        res.status(200).json({
                            estado:true,
                            doc: doc
                        })
                    }
                });
            }
        } catch (error) {
            next(error)
        }
        
    },
    delete: async function(req,res, next){
        try {
            if(req.params.id){
                await itemReparacionModel.deleteOne({
                    _id: req.params.id,
                },
                (err, doc) => {
                    if (err) {
                        res.status(400).json({
                            estado: false,
                            error:err
                        })
                    } else {
                        res.status(200).json({
                            estado: true,
                            doc: doc
                        })
                    }
                });
            }
        } catch (error) {
            next(error)
        }
    
    },
    save: async function(req,res, next){
        try {

            var insumos = req.body.list_insumos;

            if(!insumos||insumos === ""){
               insumos = undefined; 
            }

            const create = new itemReparacionModel({
                nombre: req.body.nombre,
                dificultad: req.body.dificultad,
                precio: req.body.precio,
                list_insumos : insumos
            });

            await create.save(
            (err, doc) => {
                if (err) {
                    res.status(400).json({
                        estado: false,
                        error:err
                    })
                } else {
                    res.status(200).json({
                        estado: true,
                        doc: doc
                    })
                }
            });
        
        } catch (error) {
            next(error)
        }

    }
}