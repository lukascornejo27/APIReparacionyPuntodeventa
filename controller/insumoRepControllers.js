const insumoReparacionModel = require("../models/REP_insumo");

module.exports = {
    getAll: async function(req,res, next) {

        try {

            await insumoReparacionModel.find({}, async function(error, docs){
                if(error){
                    res.status(400).json({
                        estado: false,
                        error:error
                    })
                }
                else {
                    res.status(200).json({
                        estado:true,
                        docs: docs
                    })
                }
            })

        } catch (error) {
            next(error);
        }

        
    },
    getById: async function(req, res, next){
               try {
                   if(req.params.id){
                        await insumoReparacionModel.find({_id:req.params.id},async function(error, doc){
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
                    nombre : req.body.nombre,
                    cantidad: req.body.cantidad,
                    minimo: req.body.minimo,
                    estado: req.body.estado
                }
                await insumoReparacionModel.findOneAndUpdate({
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
                await insumoReparacionModel.deleteOne({
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

                const create = new insumoReparacionModel({
                    nombre : req.body.nombre,
                    cantidad: req.body.cantidad,
                    costo: req.body.cantidad,
                    minimo: req.body.minimo,
                    estado: req.body.estado
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