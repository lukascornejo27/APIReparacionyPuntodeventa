const empleadoAdministracionModel = require("../models/ADM_empleado");

module.exports = {
    getAll: async function(req,res, next) {

        try {

            await empleadoAdministracionModel.find({}, async function(error, docs){
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
                        await empleadoAdministracionModel.find({_id:req.params.id},async function(error, doc){
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
                    nombre: req.body.nombre,
                    apellido : req.body.apellido,
                    dni : req.body.dni,
                    direccion: req.body.direccion,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    contrato: undefined,
                    cuenta: undefined,    
                }

                await empleadoAdministracionModel.findOneAndUpdate({
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
                await empleadoAdministracionModel.deleteOne({
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

                const create = new empleadoAdministracionModel({
                    nombre: req.body.nombre,
                    apellido : req.body.apellido,
                    dni : req.body.dni,
                    direccion: req.body.direccion,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    contrato: undefined,
                    cuenta: undefined,
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